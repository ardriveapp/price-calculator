import styled from 'styled-components';

export const FileComparisonContainer = styled.div`
	display: flex;
	align-items: center;
	transform: translate(-0.75rem);

	@media (min-width: 500px) {
		font-size: 16px;
	}
	@media (min-width: 720px) {
		font-size: 18px;
	}
	@media (min-width: 1200px) {
		font-size: 20px;
	}
`;

export const FileComparisonTypeIconContainer = styled.div`
	width: 1.5rem;
	height: 1.5rem;
	margin-right: 1rem;
	border-radius: 4px;
	background-color: #fafafa;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
`;
