import styled from 'styled-components';

export const AppContainer = styled.section`
	display: flex;
	flex-direction: column;
`;

export const AppContent = styled.section`
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
