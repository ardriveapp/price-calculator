import styled from 'styled-components';

export const FileComparisonContainer = styled.div`
	display: flex;
	align-items: center;
	transform: translate(-1rem);
	letter-spacing: 0.82px;
	font-size: 14px;
	color: ${(p) => p.theme.current.textColor};

	@media (min-width: 640px) {
		font-size: 16px;
	}

	p {
		font-family: 'Wavehaus-Book';
	}

	span {
		word-break: break-all;
	}

	strong {
		font-family: 'Wavehaus-Bold';
	}
`;

export const FileComparisonTypeIconContainer = styled.div`
	width: 1.5rem;
	height: 1.5rem;
	padding: 0.25rem;
	display: flex;
	justify-content: center;
	margin-right: 1rem;
	border-radius: 4px;
	background-color: ${(p) => p.theme.current.backgroundColor};
	box-shadow: ${(p) => p.theme.current.boxShadow};
	color: ${(p) => p.theme.current.textColor};
`;
