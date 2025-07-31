import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Source Sans Pro', sans-serif;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    line-height: 1.5;
    transition: background-color 0.3s ease, color 0.3s ease; /* ✅ 이 줄만 남기세요 */
    overflow-x: hidden;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  ul, ol {
    list-style: none;
  }
  table {
    border-collapse: collapse;
  }

    /* ✅ 1300px 이하일 때 스크롤은 동작하게 하되, 스크롤바는 숨김 */
  @media (max-width: 1760px) {
    html, body {
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */
    }

    html::-webkit-scrollbar,
    body::-webkit-scrollbar {
      display: none; /* Chrome, Safari */
    }
  }
`;

export default GlobalStyle;
