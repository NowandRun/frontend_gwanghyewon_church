import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  bgColor: '#213555',
  textColor: '#F5EFE7',
  cardBgColor: '#3E5879',
  borderColor: '#E0E0E0',
  mainHomePage: {
    mainNavigationIcon: '#FF8989',
    mainVisionStatementTitle: '#3E5879',
    mainVisionStatementLine: '#3E5879',
    mainVisionStatementStar: '#3E5879',
  },
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

export const lightTheme: DefaultTheme = {
  bgColor: '#FCFAFA',
  textColor: '#F5F5F5',
  cardBgColor: '#FFA673',
  borderColor: '#E0E0E0',
  mainHomePage: {
    mainNavigationIcon: '#2C3930',
    mainVisionStatementTitle: '#FFA673',
    mainVisionStatementLine: '#FFA673',
    mainVisionStatementStar: '#FFA673',
  },
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
