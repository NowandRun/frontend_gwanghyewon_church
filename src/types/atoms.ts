import { atom } from 'recoil';

// LocalStorage에서 다크 모드 상태를 불러오는 함수
const loadDarkMode = () => {
  const savedDarkMode = localStorage.getItem('isDark');
  return savedDarkMode === 'true' ? true : false;
};

// LocalStorage에 다크 모드 상태를 저장하는 함수
const saveDarkMode = (isDark: boolean) => {
  localStorage.setItem('isDark', JSON.stringify(isDark));
};

// Recoil atom 설정
export const isdarkAtom = atom({
  key: 'isDark',
  default: loadDarkMode(), // LocalStorage에서 불러온 값을 기본값으로 사용
  effects_UNSTABLE: [
    ({ onSet }) => {
      // 다크 모드 상태가 변경될 때마사 LocalStoarge에 저장
      onSet((newValue) => {
        saveDarkMode(newValue);
      });
    },
  ],
});
