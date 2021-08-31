import styled from 'styled-components';

export const CalculatorContainer = styled.section`
	width: 100%;
`;

export const DottedDivider = styled.div`
	background-image: linear-gradient(grey 17%, rgba(255, 255, 255, 0) 0%);
	background-position: left;
	background-size: 2px 10px;
	background-repeat: repeat-y;
	margin-left: 3rem;
	height: 21rem;
	display: flex;
	justify-content: space-evenly;
	flex-direction: column;

	@media (min-width: 800px) {
		margin-left: 4rem;
	}

	@media (min-width: 1200px) {
		margin-left: 5rem;
	}
`;
