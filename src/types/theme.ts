import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  bgColor: '#424242',
  textColor: '#F5F5F5',
  accentColor: '#229799',
  cardBgColor: '#48CFCB',
  media: {
    max1300: '@media (max-width: 1760px)',
    min1301: '@media (min-width: 1761px)',
  },
};

export const lightTheme: DefaultTheme = {
  bgColor: '#FCFAFA',
  textColor: '#4F81C7',
  accentColor: '#64C4ED',
  cardBgColor: '#F0D78C',
  media: {
    max1300: '@media (max-width: 1760px)',
    min1301: '@media (min-width: 1761px)',
  },
};