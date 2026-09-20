import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

interface StorageStatus {
  usedBytes: number;
  maxBytes: number;
  remainingBytes: number;
  usedMB: number;
  maxGB: number;
  usagePercentage: number;
}

// Keyframes 애니메이션 정의
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

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
      <LoadingContainer>
        <LoadingText>저장 공간 정보 로딩 중...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error || !storage) {
    return (
      <ErrorContainer>
        <span>저장 공간 정보를 불러올 수 없습니다.</span>
        <RetryButton onClick={fetchStorageStatus}>재시도</RetryButton>
      </ErrorContainer>
    );
  }

  // 꽉 찬 도넛 계산 (크기 280px, 반지름 115px, 두께 50px)
  const size = 280;
  const strokeWidth = 50;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercentage = Math.min(Math.max(storage.usagePercentage, 0), 100);
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  const getChartColor = (percent: number) => {
    if (percent >= 90) return '#ef4444';
    if (percent >= 75) return '#f97316';
    return '#ff4d4d';
  };

  const chartColor = getChartColor(storage.usagePercentage);

  return (
    <CardContainer>
      {/* 상단 헤더 & 새로고침 버튼 */}
      <Header>
        <HeaderTitleGroup>
          <SubTitle>STORAGE MONITOR</SubTitle>
          <Title>저장 용량 그래프</Title>
        </HeaderTitleGroup>
        <RefreshButton onClick={fetchStorageStatus}>
          <span>🔄</span>
          <span>새로고침</span>
        </RefreshButton>
      </Header>

      {/* 메인 콘텐츠 (범례 - 굵은 도넛 차트 - 용량 세부 수치) */}
      <MainContent>
        {/* 1. 좌측 범례 */}
        <LegendSection>
          <LegendTitle>사용 현황 범례</LegendTitle>
          <LegendList>
            <LegendItem>
              <LegendColorBox $color={chartColor} />
              <LegendText>사용 중 공간</LegendText>
            </LegendItem>
            <LegendItem>
              <LegendColorBox
                $color="#f3f4f6"
                $border="#e5e7eb"
              />
              <LegendText $isSub>여유 공간</LegendText>
            </LegendItem>
          </LegendList>
        </LegendSection>

        {/* 2. 중앙 대형 굵은 도넛 그래프 */}
        <ChartWrapper>
          <ChartSvg
            width={size}
            height={size}
          >
            {/* 배경 도넛 (빈 공간) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* 채워지는 도넛 (사용량) */}
            <ChartCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={chartColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              $dashOffset={strokeDashoffset}
              strokeLinecap="butt"
              fill="transparent"
            />
          </ChartSvg>

          {/* 도넛 중앙 텍스트 */}
          <ChartCenterText>
            <PercentageText>{storage.usagePercentage}%</PercentageText>
            <StatusText>사용 중</StatusText>
          </ChartCenterText>
        </ChartWrapper>

        {/* 3. 우측 용량 카드 상세 */}
        <DetailSection>
          <DetailCard>
            <DetailLabel>전체 용량</DetailLabel>
            <DetailValue>{storage.maxGB} GB</DetailValue>
          </DetailCard>

          <DetailCard
            $bg="#fef2f2"
            $border="#fee2e2"
          >
            <DetailLabel $color="#dc2626">현재 사용량</DetailLabel>
            <DetailValue $color="#dc2626">{storage.usedMB} MB</DetailValue>
          </DetailCard>

          <DetailCard
            $bg="#ecfdf5"
            $border="#d1fae5"
          >
            <DetailLabel $color="#059669">남은 용량</DetailLabel>
            <DetailValue $color="#059669">
              {(storage.remainingBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
            </DetailValue>
          </DetailCard>
        </DetailSection>
      </MainContent>
    </CardContainer>
  );
}

/* ==========================================================================
   Styled Components
   ========================================================================== */

const CardContainer = styled.div`
  max-width: 56rem;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1.5rem;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;

  @media (min-width: 640px) {
    padding: 2.5rem;
  }
`;

const LoadingContainer = styled.div`
  max-width: 56rem;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

const LoadingText = styled.span`
  color: #9ca3af;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  max-width: 56rem;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fef2f2;
  color: #ef4444;
  border-radius: 1rem;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RetryButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #fca5a5;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 2rem;
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.span`
  font-size: 0.75rem;
  font-weight: 800;
  color: #ef4444;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.025em;
  margin: 0.125rem 0 0 0;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #4b5563;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1rem 0;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const LegendSection = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 25%;
  }
`;

const LegendTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const LegendList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LegendColorBox = styled.span<{ $color: string; $border?: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 0.375rem;
  background-color: ${(props) => props.$color};
  border: ${(props) => (props.$border ? `1px solid ${props.$border}` : 'none')};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const LegendText = styled.span<{ $isSub?: boolean }>`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${(props) => (props.$isSub ? '#9ca3af' : '#374151')};
`;

const ChartWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin: 1rem 0;

  @media (min-width: 768px) {
    margin: 0;
  }
`;

const ChartSvg = styled.svg`
  transform: rotate(-90deg);
`;

const ChartCircle = styled.circle<{ $dashOffset: number }>`
  stroke-dashoffset: ${(props) => props.$dashOffset};
  transition: stroke-dashoffset 1s ease-in-out;
`;

const ChartCenterText = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const PercentageText = styled.span`
  font-size: 2.25rem;
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.025em;
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const DetailSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 768px) {
    width: 33.333333%;
  }
`;

const DetailCard = styled.div<{ $bg?: string; $border?: string }>`
  padding: 1rem;
  background-color: ${(props) => props.$bg || '#f9fafb'};
  border-radius: 1rem;
  border: 1px solid ${(props) => props.$border || '#f3f4f6'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailLabel = styled.span<{ $color?: string }>`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => props.$color || '#6b7280'};
`;

const DetailValue = styled.span<{ $color?: string }>`
  font-size: 1rem;
  font-weight: 900;
  color: ${(props) => props.$color || '#1f2937'};
`;
