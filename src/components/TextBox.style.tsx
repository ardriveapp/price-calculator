import styled from 'styled-components';

export const TextBoxInput = styled.input`
	width: 65%;
	height: 50%;
	padding: 0 1rem;
	outline: none;

	@media (min-width: 800px) {
		padding: 0 2rem;
	}
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

	border: 1px;
	border-color: transparent;
	border-style: solid;

	:focus-within {
		border-color: #4c4c4c;
		box-shadow: 0 0 15px 10px rgba(20, 46, 110, 0.1);
	}

	:first-child {
		margin-bottom: 3rem;

		@media (min-width: 800px) {
			margin-bottom: 5rem;
		}
	}

	@media (min-width: 800px) {
		height: 65px;
	}

	@media (min-width: 1200px) {
		height: 75px;
	}
`;
