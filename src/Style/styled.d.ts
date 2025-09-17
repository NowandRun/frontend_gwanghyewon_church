import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    cardBgColor: string;
    headerWidth: {
      default: string;
      responsive: string;
    };

    mainHomePage: {
      mainNavigationIcon: string;
      mainVisionStatementTitle: string;
      mainVisionStatementLine: string;
      mainVisionStatementStar: string;
    };

    media: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  }
}
