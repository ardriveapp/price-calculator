import styled from 'styled-components';

import { createGlobalStyle } from 'styled-components';
import Wavehaus from '../fonts/Wavehaus/Wavehaus-42Light.woff';
import WavehausBold from '../fonts/Wavehaus/Wavehaus-128Bold.woff';

export const GlobalStyle = createGlobalStyle`
  	 @font-face {
        font-family: 'Wavehaus';
		font-style: normal;
        src: local('Wavehaus'), url(${Wavehaus}) format('woff');
    }
	@font-face {
        font-family: 'Wavehaus';
		font-style: normal;
		font-weight:900;
        src: local('Wavehaus'), url(${WavehausBold}) format('woff');
    }

`;

export const AppContainer = styled.section`
	font-family: 'Wavehaus';
	align-items: center;
	justify-content: center;
	margin: 6rem auto auto auto;
	padding: 1rem;
	max-width: 1080px;
	align-items: center;
	justify-content: center;
	display: flex;
	flex-direction: column;
	font-family: 'Wavehaus';
	font-size: 16px;
	@media (min-width: 500px) {
		padding-right: 2rem;
		padding-left: 2rem;
		font-size: 18px;
	}
	@media (min-width: 720px) {
		flex-direction: row;
		padding-right: 3rem;
		padding-left: 3rem;
		font-size: 20px;
	}
	@media (min-width: 1200px) {
		padding-right: 10rem;
		padding-left: 10rem;
		font-size: 24px;
	}
`;
