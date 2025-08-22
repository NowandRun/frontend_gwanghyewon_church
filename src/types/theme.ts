import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  bgColor: '#424242',
  textColor: '#F5F5F5',
  accentColor: '#229799',
  cardBgColor: '#48CFCB',
  headerWidth: {
    default: '70%',
    responsive: '100%'
  },
  media: {
    max1300: '@media (max-width: 1150px)',
    min1301: '@media (min-width: 1151px)',
  },
};

export const lightTheme: DefaultTheme = {
  bgColor: '#FCFAFA',
  textColor: '#4F81C7',
  accentColor: '#64C4ED',
  cardBgColor: '#F0D78C',
  headerWidth: {
    default: '70%',
    responsive: '100%'
  },
  media: {
    max1300: '@media (max-width: 1150px)',
    min1301: '@media (min-width: 1151px)',
  },
};