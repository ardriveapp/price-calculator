import styled from 'styled-components';

export const TextBoxInput = styled.input`
	width: 65%;
	height: 50%;
	outline: none;
	margin: 0 1rem;
	color: ${(props) => props.theme.current.textColor};

	@media (min-width: 800px) {
		margin: 0 2rem;
	}
`;

export const TextBoxContainer = styled.div<{ hasError: boolean }>`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 55px;
	border-radius: 8px;
	background-color: ${(props) => props.theme.current.backgroundColor};
	box-shadow: ${(props) => props.theme.current.boxShadow};
	font-family: 'Wavehaus-Bold';

	border-width: ${(p) => (p.hasError ? `3px` : `1px`)};
	border-color: ${(p) =>
		p.hasError ? 'red' : p.theme.current.borderColorSelected};
	border-style: solid;

	${(p) => p.hasError && `border-color: red`}

	:focus-within {
		// border-color: ${(props) => props.theme.current.borderColorSelected};
		box-shadow: ${(props) => props.theme.current.boxShadowSelected};
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

export const ErrorMessage = styled.span`
	color: red;
	position: absolute;
	font-family: 'Wavehaus-Bold';

	font-size: 12px;
	padding-top: 6.5rem;

	@media (min-width: 324px) {
		padding-top: 5.5rem;
	}

	@media (min-width: 480px) {
		font-size: 14px;
		padding-left: 3rem;
	}

	@media (min-width: 640px) {
		padding-left: 6rem;
	}

	@media (min-width: 800px) {
		padding-left: 1rem;
		padding-top: 6.5rem;
	}

	@media (min-width: 1200px) {
		padding-left: 5rem;
		padding-top: 7.5rem;
	}
`;
