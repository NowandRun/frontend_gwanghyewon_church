import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    mainNavigationIcon: string;
    cardBgColor: string;
    headerWidth: {
      default: string;
      responsive: string;
    };
    media: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  }
}
