import styled from 'styled-components';

export const ExpandableContainer = styled.div`
	padding: 1.5rem 1rem 1.5rem 0;
	font-family: 'Wavehaus-Book';

	:not(:last-child) {
		border-bottom: 1px;
		border-color: black;
		border-bottom-style: solid;
	}
`;

export const ExpandableTitle = styled.button`
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	text-align: left;
`;

export const ExpandableTrailingIcon = styled.div`
	padding-left: 1rem;
	height: 1rem;
	width: 1rem;
	display: flex;
	justify-content: center;
`;
