// src/hooks/useAdminIdleLogout.ts
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authTokenVar, isLoggedInAccessTokenVar } from '../types/apollo';
import { LOCALSTORAGE_TOKEN } from '../types/constants';

const IDLE_TIME = 60 * 60; // ✅ 1시간 (3600초)
const WARNING_TIME = 30; // ⚠️ 경고 시작 (30초)

export const useAdminIdleLogout = (enabled: boolean) => {
  const navigate = useNavigate();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [remainSeconds, setRemainSeconds] = useState(IDLE_TIME);
  const [showWarning, setShowWarning] = useState(false);

  const logout = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar('');
    isLoggedInAccessTokenVar(false);
    sessionStorage.setItem('authError', 'idle-timeout');
    navigate('/admin/login', { replace: true });
  };

  const resetTimer = () => {
    if (!enabled) return;

    // 타이머 초기화
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    setRemainSeconds(IDLE_TIME);
    setShowWarning(false);

    // 1초마다 카운트 감소
    intervalRef.current = setInterval(() => {
      setRemainSeconds((prev) => {
        const next = prev - 1;
        if (next <= WARNING_TIME) {
          setShowWarning(true);
        }

        return next;
      });
    }, 1000);
    timeoutRef.current = setTimeout(logout, IDLE_TIME * 1000);
  };

  useEffect(() => {
    if (!enabled) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [enabled]);

  return { remainSeconds, showWarning };
};
