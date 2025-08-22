import React from 'react';
import styled from "styled-components";

function Footer() {
	return(
		<StyledFooter>
			<FooterLogo>로고</FooterLogo>
			<FooterMiddleText>
				<p>충북 진천군 광혜원면 화랑3길 17</p>
				<FooterMiddleTexttwo>Copyright @ 2025 <span>Gwanghyewon Full Gospel Church</span>  ALL rights reserved.</FooterMiddleTexttwo>
			</FooterMiddleText>
		</StyledFooter>
	);
};

export default Footer;

const StyledFooter = styled.footer`
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		width: 100%;
		background-color:${(props) => props.theme.bgColor};
${({theme}) => theme.media.max1300} {
    height: 100px;
  }
		
`;

const FooterLogo = styled.div`
padding-right: 50px;
  ${({theme}) => theme.media.max1300} {
    font-size: 0.8rem;
  }
`;

const FooterMiddleText = styled.p`
color: ${(props)=> props.theme.textColor};
  ${({theme}) => theme.media.max1300} {
    font-size: 0.6rem;
  }
`;

const FooterMiddleTexttwo = styled.p`
color: ${(props)=> props.theme.textColor};
	span{
		text-transform: uppercase;
		color: #78B9B5;
	};
	  ${({theme}) => theme.media.max1300} {
    font-size: 0.6rem;
  }
`;