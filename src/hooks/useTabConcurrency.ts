// hooks/useTabConcurrency.ts
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PAGE_IDS = {
  CHURCH_INFO: '교회소식_편집',
  CHURCH_BULLETIN: '교회주보_편집',
  CHURCH_ALBUM: '교회주보_편집',
};

export const useTabConcurrency = (pageName: string) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 'admin_concurrency_channel'이라는 이름의 채널 생성
    const bc = new BroadcastChannel('admin_concurrency_channel');

    // 1. 페이지 진입 시 다른 탭에 "나 이 페이지 들어왔어"라고 알림
    bc.postMessage({ type: 'PAGE_ENTER', page: pageName, timestamp: Date.now() });

    // 2. 다른 탭으로부터 메시지를 받았을 때 처리
    bc.onmessage = (event) => {
      const { type, page } = event.data;

      // 같은 편집 페이지에 누군가 새로 들어왔을 때
      if (type === 'PAGE_ENTER' && page === pageName) {
        alert(
          '다른 탭에서 동일한 편집 페이지가 열렸습니다. 중복 수정을 방지하기 위해 메인으로 이동합니다.',
        );
        navigate('/');
      }
    };

    return () => {
      bc.close(); // 컴포넌트 언마운트 시 채널 닫기
    };
  }, [pageName, navigate]);
};
