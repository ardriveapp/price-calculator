import styled, { css } from 'styled-components';

export const ExpandableContainer = styled.div`
	padding: 1.5rem 1rem 1.5rem 0;
	font-family: 'Wavehaus-Book';

	:not(:last-child) {
		border-bottom: 0.25px;
		border-color: #121212;
		border-bottom-style: solid;
	}
	p {
		padding-top: 1rem;
	}
`;

export const ExpandableTitle = styled.button<{ expanded: boolean }>`
	display: flex;
	justify-content: space-between;
	width: 100%;
	align-items: center;
	text-align: left;
	letter-spacing: 1.09px;
	font-family: ${(p) => (p.expanded ? 'Wavehaus-Semi' : 'Wavehaus-Book')};
`;

export const flipIcon = css`
	transform: scaleY(-1);
	-moz-transform: scaleY(-1);
	-webkit-transform: scaleY(-1);
	-ms-transform: scaleY(-1);
`;

export const ExpandableTrailingIcon = styled.div<{ expanded: boolean }>`
	padding-left: 1rem;
	height: 1rem;
	width: 1rem;
	display: flex;
	justify-content: center;
	${(p) => !p.expanded && flipIcon};
`;
