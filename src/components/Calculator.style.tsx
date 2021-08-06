import styled from 'styled-components';

export const CalculatorContainer = styled.section`
	width: 100%;
	margin: 0.5rem;
	@media (min-width: 720px) {
		margin-right: 5rem;
	}
	@media (min-width: 1200px) {
		margin-right: 10rem;
	}
`;
export const SolidDivider = styled.div`
	border-left-style: solid;
	border-left-color: black;
	border-left-width: 1px;
	height: 5rem;
	margin-left: 5rem;
`;
export const DottedDivider = styled.div`
	background-image: linear-gradient(grey 17%, rgba(255, 255, 255, 0) 0%);
	background-position: left;
	background-size: 2px 10px;
	background-repeat: repeat-y;
	height: 21rem;
	margin-left: 5rem;
	display: flex;
	justify-content: space-evenly;
	flex-direction: column;
`;
