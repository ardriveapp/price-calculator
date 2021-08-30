import styled from 'styled-components';

export const FaqContainer = styled.section`
	letter-spacing: 1.09px;
	width: 100%;
	padding-top: 4rem;
	display: flex;
	flex-direction: column;

	h2 {
		font-family: 'Wavehaus-Extra';
		padding-bottom: 1rem;
	}

	@media (min-width: 800px) {
		padding-top: 0rem;
		padding-left: 6rem;
	}

	@media (min-width: 1200px) {
		padding-top: 0rem;
		padding-left: 8rem;
	}
`;

export const VersionNumber = styled.span`
	font-family: 'Wavehaus-Bold';
	font-size: 14px;
	letter-spacing: 0.82px;
	padding-top: 6rem;
	color: #3c3c3c;

	@media (min-width: 800px) {
		font-size: 16px;
	}

	@media (min-width: 1200px) {
		font-size: 18px;
	}
	justify-self: flex-end;
	align-self: flex-end;
	text-align: right;
`;
