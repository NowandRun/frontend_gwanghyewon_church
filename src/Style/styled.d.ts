import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    isDark: boolean;
    textColor: string;
    bgColor: string;
    accentColor: string;
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
