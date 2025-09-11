import { atom, selector } from 'recoil';

// Window innerWidth값 감지
export const windowWidthAtom = atom({
  key: 'windowWidth',
  default: window.innerWidth,
});

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

// Slide 한번에 보여줄 개수 (70vw 기준)
export const slideCnt = selector({
  key: 'slideCnt',
  get: ({ get }) => {
    const windowWidth = get(windowWidthAtom);

    // 70vw 기준으로 한 번에 보여줄 개수 결정
    if (windowWidth > 1150) {
      return 4; // 70vw가 1400px 이상이면 4개
    } else if (windowWidth > 800) {
      return 3; // 아니면 3개
    } else {
      return 2;
    }
  },
});
