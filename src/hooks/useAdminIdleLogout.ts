import { useEffect, useRef } from 'react';
import { authTokenVar, isLoggedInAccessTokenVar, authErrorReasonVar } from '../types/apollo';
import { LOCALSTORAGE_TOKEN } from '../types/constants';

const IDLE_LIMIT = 1000 * 60 * 90; // 1분

export const useAdminIdleLogout = (enabled: boolean) => {
  // ✅ Hook은 최상단
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const logout = () => {
      localStorage.removeItem(LOCALSTORAGE_TOKEN);

      // ⭐ 핵심: 로그아웃 사유 저장
      localStorage.setItem('LAST_LOGOUT_REASON', 'IDLE_TIMEOUT');

      authTokenVar(null);
      isLoggedInAccessTokenVar(false);
      authErrorReasonVar('IDLE_TIMEOUT');
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(logout, IDLE_LIMIT);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    // 최초 진입 시 타이머 시작
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [enabled]);
};
