import styled from 'styled-components';

export const ExpandableContainer = styled.div`
	padding: 1rem;
	font-family: 'Wavehaus-Book';

	:not(:last-child) {
		border-bottom: 1px;
		border-color: black;
		border-bottom-style: solid;
	}
`;

export const ExpandableTitle = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 0.5rem;
`;

export const ExpandableTrailingIcon = styled.div`
	padding-left: 1rem;
	height: 1rem;
	width: 1rem;
`;
