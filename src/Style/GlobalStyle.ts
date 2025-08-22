import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    transition: background-color 1s ease, color 1s ease;
  };

  html, body {
    font-family: 'Source Sans Pro', sans-serif;
    overflow-x: hidden;
  };
  a {
    text-decoration: none;
    color: inherit;
  };
  ul, ol {
    list-style: none;
  };
  table {
    border-collapse: collapse;
  };



  /* ✅ 1150px 이하일 때 스크롤은 동작하게 하되, X축·Y축 스크롤바를 숨김 */
  @media (max-width: 1150px) {
    html, body {
      overflow: auto; /* 스크롤 가능 */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE, Edge */
    }

    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
      width: 0;  /* 세로 스크롤바 너비 0 */
      height: 0; /* 가로 스크롤바 높이 0 */
    }
  }
`;

export default GlobalStyle;
