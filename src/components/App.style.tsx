import styled from 'styled-components';

export const AppContainer = styled.section`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	min-height: 100vh;
	width: 100%;
	max-width: 1200px;
	padding: 2rem 4rem;

	@media (min-height: 1000px) and (min-width: 800px) {
		padding-top: 10rem;
	}

	@media (min-height: 1200px) and (min-width: 800px) {
		padding-top: 12rem;
	}

	@media (min-height: 1400px) and (min-width: 800px) {
		padding-top: 18rem;
	}

	@media (min-height: 1600px) and (min-width: 800px) {
		padding-top: 24rem;
	}

	@media (min-height: 1800px) and (min-width: 800px) {
		padding-top: 30rem;
	}

	@media (min-height: 2000px) and (min-width: 800px) {
		padding-top: 36rem;
	}

	@media (min-height: 2300px) and (min-width: 800px) {
		padding-top: 43rem;
	}

	@media (min-height: 2600px) and (min-width: 800px) {
		padding-top: 52rem;
	}
`;

export const AppContent = styled.section`
	display: flex;
	flex-direction: column;
	font-size: 14px;
	letter-spacing: 0.19px;

	@media (min-width: 640px) {
		font-size: 16px;
	}

	@media (min-width: 800px) {
		flex-direction: row;
		font-size: 20px;
	}

	@media (min-width: 1200px) {
		font-size: 24px;
	}
`;
