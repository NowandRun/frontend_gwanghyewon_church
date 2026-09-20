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

      // 💡 백엔드 도메인/엔드포인트 주소에 맞게 수정해주세요. (예: /api/uploads/storage-status 또는 http://localhost:4000/uploads/storage-status)
      const response = await fetch('/uploads/storage-status', {
        headers: {
          // 인증이 필요한 API라면 토큰을 함께 전송합니다.
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
      <div className="w-full p-5 rounded-xl bg-gray-50 animate-pulse h-28 border border-gray-200" />
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

  const getBarColor = (percent: number): string => {
    if (percent >= 90) return 'bg-red-500';
    if (percent >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="w-full p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-gray-800">📁 파일 저장 공간</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            최대 {storage.maxGB}GB
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">
            {storage.usagePercentage}% 사용 중
          </span>
          <button
            onClick={fetchStorageStatus}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="새로고침"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${getBarColor(
            storage.usagePercentage,
          )}`}
          style={{ width: `${Math.min(storage.usagePercentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
        <span>
          사용량: <strong className="text-gray-700">{storage.usedMB} MB</strong>
        </span>
        <span>
          남은 용량:{' '}
          <strong className="text-gray-700">
            {(storage.remainingBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
          </strong>
        </span>
      </div>

      {storage.usagePercentage >= 90 && (
        <div className="mt-2 p-2.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium flex items-center justify-between">
          <span>⚠️ 저장 공간이 부족합니다. 더 이상 파일이 업로드되지 않을 수 있습니다.</span>
        </div>
      )}
    </div>
  );
}
