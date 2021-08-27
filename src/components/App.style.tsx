import styled from 'styled-components';

export const AppContainer = styled.section`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	min-height: 100vh;
	width: 80vw;
	max-width: 1080px;
`;

export const AppContent = styled.section`
	display: flex;
	justify-content: space-between;
	flex-direction: row;
	font-size: 16px;
	letter-spacing: 0.19px;
	flex-grow: 1;

	@media (min-width: 500px) {
		font-size: 18px;
	}

	@media (min-width: 720px) {
		flex-direction: row;
		font-size: 20px;
	}

	@media (min-width: 1200px) {
		font-size: 24px;
	}
`;
