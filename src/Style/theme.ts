import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  bgColor: '#424242',
  textColor: '#F5F5F5',
  accentColor: '#DC143C',
  cardBgColor: '#48CFCB',
  headerWidth: {
    default: '70vw',
    responsive: '100%',
  },
  borderColor: '#E0E0E0',
  media: {
    desktop: '@media (min-width: 1151px)',
    tablet: '@media (max-width: 1150px)',
    mobile: '@media (max-width: 800px)',
  },
};

export const lightTheme: DefaultTheme = {
  bgColor: '#FCFAFA',
  textColor: '#4F81C7',
  accentColor: '#0046FF',
  cardBgColor: '#F0D78C',
  borderColor: '#E0E0E0',
  headerWidth: {
    default: '70vw',
    responsive: '100%',
  },
  media: {
    desktop: '@media (min-width: 1151px)',
    tablet: '@media (max-width: 1150px)',
    mobile: '@media (max-width: 800px)',
  },
};
