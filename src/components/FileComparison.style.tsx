import styled from 'styled-components';

export const FileComparisonContainer = styled.div`
	display: flex;
	align-items: center;
	transform: translate(-1rem);
	letter-spacing: 0.82px;
	font-size: 11px;

	@media (min-width: 640px) {
		font-size: 13px;
	}
	@media (min-width: 800px) {
		font-size: 14px;
	}
	@media (min-width: 1200px) {
		font-size: 16px;
	}

	p {
		font-family: 'Wavehaus-Book';
		word-break: break-all;
	}

	span {
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
	background-color: #fafafa;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
`;
