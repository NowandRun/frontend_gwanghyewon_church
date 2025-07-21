import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    textColor: string;
    bgColor: string;
    accentColor: string;
    cardBgColor: string;
    headerWidth: {
      default: string;
      responsive: string;
    };
    media: {
      max1300: string;
      min1301: string;
    };
  }
}
