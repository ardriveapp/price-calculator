import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';

import WavehausBook from '../fonts/Wavehaus/Wavehaus-66Book.woff';
import WavehausBold from '../fonts/Wavehaus/Wavehaus-128Bold.woff';
import WavehausSemiBold from '../fonts/Wavehaus/Wavehaus-95SemiBold.woff';
import WavehausExtraBold from '../fonts/Wavehaus/Wavehaus-158ExtraBold.woff';

export const GlobalStyle = createGlobalStyle`
  	@font-face {
        font-family: 'Wavehaus-Book';
        src: local('Wavehaus-Book'), url(${WavehausBook}) format('woff');
    }

    @font-face {
        font-family: 'Wavehaus-Semi';
        src: local('Wavehaus-Semi'), url(${WavehausSemiBold}) format('woff');
    }

    @font-face {
        font-family: 'Wavehaus-Extra';
        src: local('Wavehaus-Extra'), url(${WavehausExtraBold}) format('woff');
    }

	  @font-face {
        font-family: 'Wavehaus-Bold';
        src: local('Wavehaus-Bold'), url(${WavehausBold}) format('woff');
    }
`;

export const AppContainer = styled.section`
	align-items: center;
	justify-content: center;
	padding: 1rem;
	max-width: 1080px;
	width: 100%;
	display: flex;
	flex-direction: column;
	font-size: 16px;
	letter-spacing: 0.19px;

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
