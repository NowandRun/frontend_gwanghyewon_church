import React, { useEffect, useState, useCallback } from 'react';

// StorageGauge 컴포넌트
interface StorageStatus {
  usedBytes: number;
  maxBytes: number;
  remainingBytes: number;
  usedMB: number;
  maxGB: number;
  usagePercentage: number;
}

export default function StorageGauge() {
  const [storage, setStorage] = useState<StorageStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // REST API 호출 함수
  const fetchStorageStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch('/uploads/storage-status', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch storage status');
      }

      const data = await response.json();
      setStorage(data);
    } catch (err) {
      console.error('Storage status fetch error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStorageStatus();
  }, [fetchStorageStatus]);

  if (loading) {
    return (
      <div className="w-full p-6 rounded-2xl bg-gray-50 animate-pulse h-40 border border-gray-200" />
    );
  }

  if (error || !storage) {
    return (
      <div className="w-full p-4 rounded-xl bg-red-50 text-sm text-red-500 border border-red-200 flex items-center justify-between">
        <span>저장 공간 정보를 불러올 수 없습니다.</span>
        <button
          onClick={fetchStorageStatus}
          className="px-2.5 py-1 text-xs font-semibold bg-red-100 hover:bg-red-200 rounded text-red-700 transition-colors"
        >
          재시도
        </button>
      </div>
    );
  }

  // 사용률에 따른 색상 설정
  const getColorHex = (percent: number): string => {
    if (percent >= 90) return '#ef4444'; // red-500
    if (percent >= 75) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
  };

  const strokeColor = getColorHex(storage.usagePercentage);

  // SVG 원형 게이지 계산
  const radius = 36;
  const circumference = 2 * Math.PI * radius; // 둘레 (약 226.19)
  const safePercentage = Math.min(Math.max(storage.usagePercentage, 0), 100);
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="w-full p-6 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-4">
      {/* 헤더 부분 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-800">📁 서버 저장 공간</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            최대 {storage.maxGB} GB
          </span>
        </div>
        <button
          onClick={fetchStorageStatus}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="새로고침"
        >
          🔄
        </button>
      </div>

      {/* 원형 그래프 및 용량 정보 컨테이너 */}
      <div className="flex items-center gap-6 pt-1">
        {/* SVG 원형 그래프 */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            {/* 배경 원 */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="text-gray-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            {/* 데이터 진행 원 */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* 중앙 퍼센트 텍스트 */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-lg font-bold text-gray-800">{storage.usagePercentage}%</span>
            <span className="text-[10px] text-gray-400 font-medium">사용 중</span>
          </div>
        </div>

        {/* 오른쪽 상세 용량 텍스트 */}
        <div className="flex-1 space-y-2 text-sm">
          <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl">
            <span className="text-gray-500 font-medium">사용량</span>
            <span className="font-bold text-gray-800">{storage.usedMB} MB</span>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl">
            <span className="text-gray-500 font-medium">남은 용량</span>
            <span className="font-bold text-emerald-600">
              {(storage.remainingBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
            </span>
          </div>
        </div>
      </div>

      {/* 용량 부족 경고 메시지 */}
      {storage.usagePercentage >= 90 && (
        <div className="mt-2 p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium flex items-center gap-2 border border-red-100">
          <span>⚠️</span>
          <span>저장 공간이 90% 이상 차서 파일 업로드가 실패할 수 있습니다.</span>
        </div>
      )}
    </div>
  );
}
