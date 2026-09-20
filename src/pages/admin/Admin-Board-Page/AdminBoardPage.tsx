import React, { useEffect, useState, useCallback } from 'react';

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
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gray-50 animate-pulse h-64 border border-gray-200" />
    );
  }

  if (error || !storage) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-xl bg-red-50 text-sm text-red-500 border border-red-200 flex items-center justify-between">
        <span>저장 공간 정보를 불러올 수 없습니다.</span>
        <button
          onClick={fetchStorageStatus}
          className="px-3 py-1.5 text-xs font-semibold bg-red-100 hover:bg-red-200 rounded-lg text-red-700 transition-colors"
        >
          재시도
        </button>
      </div>
    );
  }

  // 색상 설정
  const getColorHex = (percent: number): string => {
    if (percent >= 90) return '#ef4444'; // red-500
    if (percent >= 75) return '#f59e0b'; // amber-500
    return '#3b82f6'; // blue-500 (메인 주황색/관리자 테마와 잘 어울리는 블루)
  };

  const strokeColor = getColorHex(storage.usagePercentage);

  // SVG 원형 게이지 값 계산 (크기 176px, 반지름 70)
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // 약 439.82
  const safePercentage = Math.min(Math.max(storage.usagePercentage, 0), 100);
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    // 📌 max-w-2xl mx-auto 로 웹 화면 중앙 정렬
    <div className="max-w-2xl mx-auto p-8 bg-white border border-gray-100 rounded-2xl shadow-lg space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">📁</span>
          <h3 className="text-lg font-bold text-gray-800">서버 파일 저장 공간</h3>
        </div>
        <button
          onClick={fetchStorageStatus}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
          title="새로고침"
        >
          <span>🔄</span>
          <span>새로고침</span>
        </button>
      </div>

      {/* 메인 콘텐츠 (좌: 원형 그래프 / 우: 용량 정보) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-10 py-2">
        {/* 1. 크고 두꺼워진 SVG 원형 그래프 */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-44 h-44 transform -rotate-90">
            {/* 배경 원 */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              className="text-gray-100"
              strokeWidth="14" // 👈 선 두께를 14로 두껍게 변경
              stroke="currentColor"
              fill="transparent"
            />
            {/* 데이터 슬라이더 원 */}
            <circle
              cx="88"
              cy="88"
              r={radius}
              stroke={strokeColor}
              strokeWidth="14" // 👈 선 두께 동일하게 설정
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* 원 중앙 퍼센트 표시 */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-gray-800">
              {storage.usagePercentage}%
            </span>
            <span className="text-xs font-semibold text-gray-400 mt-0.5">사용 중</span>
          </div>
        </div>

        {/* 2. 그래프 우측 상세 정보 박스 */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-500">전체 저장 용량</span>
            <span className="text-base font-bold text-gray-800">{storage.maxGB} GB</span>
          </div>

          <div className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-500">현재 사용량</span>
            <span className="text-base font-bold text-blue-600">{storage.usedMB} MB</span>
          </div>

          <div className="flex justify-between items-center p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <span className="text-sm font-medium text-emerald-700">남은 용량</span>
            <span className="text-base font-bold text-emerald-600">
              {(storage.remainingBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
            </span>
          </div>
        </div>
      </div>

      {/* 90% 이상 경고 안내 */}
      {storage.usagePercentage >= 90 && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-600 text-xs font-semibold flex items-center gap-2 border border-red-200">
          <span>⚠️</span>
          <span>저장 공간이 부족합니다! 더 이상 파일이 업로드되지 않을 수 있습니다.</span>
        </div>
      )}
    </div>
  );
}
