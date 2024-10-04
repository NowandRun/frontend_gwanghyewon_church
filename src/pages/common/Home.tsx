import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.textColor};
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

function Home() {
  return (
    <Container>
      <span>hello</span>
    </Container>
  );
}

export default Home;
