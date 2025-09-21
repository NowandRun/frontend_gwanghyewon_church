import { DefaultTheme } from 'styled-components';

/* carBgColor:154D71*/
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
  SubPage: {
    WebSubNavTitleBg: '#FFDDAB',
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
/* carBgColor:896C6C , BF9264, C599B6, 819A91,6F826A,  154D71, F79B72 , 80CBC4, 16C47F, DCC5B2, D9A299*/
export const lightTheme: DefaultTheme = {
  bgColor: '#FCFAFA',
  textColor: '#F5F5F5',
  cardBgColor: '#6F826A',
  borderColor: '#E0E0E0',
  mainHomePage: {
    mainNavigationIcon: '#2C3930',
    mainVisionStatementTitle: '#6F826A',
    mainVisionStatementLine: '#6F826A',
    mainVisionStatementStar: '#6F826A',
  },
  headerWidth: {
    default: '70vw',
    responsive: '100%',
  },
  SubPage: {
    WebSubNavTitleBg: '#DDA853',
  },
  media: {
    desktop: '@media (min-width: 1024px)',
    tablet: '@media (max-width: 1023px)',
    mobile: '@media (max-width: 480px)',
  },
};
