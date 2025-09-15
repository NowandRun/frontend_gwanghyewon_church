import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  bgColor: '#213555',
  textColor: '#F5EFE7',
  cardBgColor: '#3E5879',
  mainNavigationIcon: '#FF8989',
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
  textColor: '#F5F5F5',
  mainNavigationIcon: '#2C3930',

  cardBgColor: '#48CFCB',
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
