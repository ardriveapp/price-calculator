import styled from 'styled-components';

export const TextBoxInput = styled.input`
	width: 65%;
	height: 50%;
	margin: 0 2rem;
`;

export const TextBoxContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 55px;
	border-radius: 8px;
	background-color: #fafafa;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
	font-family: 'Wavehaus-Bold';

	@media (min-width: 800px) {
		height: 65px;
	}

	@media (min-width: 1200px) {
		height: 75px;
	}
`;
