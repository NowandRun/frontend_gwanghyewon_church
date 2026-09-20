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
      <div className="max-w-4xl mx-auto my-8 p-10 bg-white rounded-3xl shadow-md border border-gray-100 flex items-center justify-center h-80">
        <span className="text-gray-400 font-medium">저장 공간 정보 로딩 중...</span>
      </div>
    );
  }

  if (error || !storage) {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-red-50 text-red-500 rounded-2xl border border-red-200 flex items-center justify-between">
        <span>저장 공간 정보를 불러올 수 없습니다.</span>
        <button
          onClick={fetchStorageStatus}
          className="px-4 py-2 text-xs font-bold bg-red-100 hover:bg-red-200 rounded-xl text-red-700 transition-all"
        >
          재시도
        </button>
      </div>
    );
  }

  // 꽉 찬 도넛 계산 (크기 280px, 반지름 90, 두께 50)
  const size = 280;
  const strokeWidth = 50; // 👈 굵고 탄탄한 도넛 두께
  const radius = (size - strokeWidth) / 2; // 115
  const circumference = 2 * Math.PI * radius; // 둘레
  const safePercentage = Math.min(Math.max(storage.usagePercentage, 0), 100);
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  // 상태별 그래프 색상 (예시 이미지의 메인 레드/오렌지 포인트 컬러 반영)
  const getChartColor = (percent: number) => {
    if (percent >= 90) return '#ef4444'; // Red
    if (percent >= 75) return '#f97316'; // Orange
    return '#ff4d4d'; // 예시 이미지 스타일의 비비드 레드/핑키 계열
  };

  const chartColor = getChartColor(storage.usagePercentage);

  return (
    <div className="max-w-4xl mx-auto my-8 p-8 sm:p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
      {/* 상단 헤더 & 새로고침 버튼 */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
        <div>
          <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider">
            STORAGE MONITOR
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
            도넛 저장 용량 그래프
          </h2>
        </div>
        <button
          onClick={fetchStorageStatus}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
        >
          <span>🔄</span>
          <span>새로고침</span>
        </button>
      </div>

      {/* 메인 콘텐츠 (3단 레이아웃: 범례 - 굵은 도넛 차트 - 용량 세부 수치) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
        {/* 1. 좌측 범례 (Example 1 디자인 참고) */}
        <div className="w-full md:w-1/4 space-y-4">
          <h3 className="text-lg font-extrabold text-gray-800">사용 현황 범례</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-md inline-block shadow-sm"
                style={{ backgroundColor: chartColor }}
              />
              <span className="text-sm font-bold text-gray-700">사용 중 공간</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 rounded-md bg-gray-100 border border-gray-200 inline-block" />
              <span className="text-sm font-bold text-gray-400">여유 공간</span>
            </div>
          </div>
        </div>

        {/* 2. 중앙 대형 굵은 도넛 그래프 */}
        <div className="relative flex items-center justify-center shrink-0 my-4 md:my-0">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            {/* 배경 도넛 (빈 공간) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f3f4f6" // gray-100
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* 채워지는 도넛 (사용량) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={chartColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="butt" // 단면을 깔끔하게 채움
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>

          {/* 도넛 중앙 텍스트 */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-gray-900 tracking-tight">
              {storage.usagePercentage}%
            </span>
            <span className="text-sm font-bold text-gray-500 mt-1">사용 중</span>
          </div>
        </div>

        {/* 3. 우측 용량 카드 상세 */}
        <div className="w-full md:w-1/3 space-y-3">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500">전체 용량</span>
            <span className="text-base font-black text-gray-800">{storage.maxGB} GB</span>
          </div>

          <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 flex justify-between items-center">
            <span className="text-xs font-bold text-red-600">현재 사용량</span>
            <span className="text-base font-black text-red-600">{storage.usedMB} MB</span>
          </div>

          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-600">남은 용량</span>
            <span className="text-base font-black text-emerald-600">
              {(storage.remainingBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
