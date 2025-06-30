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
    transition-duration: 1s;
    line-height: 1.5;
    > ::-webkit-scrollbar {
    display: none;
  }
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
  
  html, body {
    overflow: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  html::-webkit-scrollbar,
  body::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;

export default GlobalStyle;
