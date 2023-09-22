import styled, { css } from 'styled-components';

export const DropDownListItem = styled.button`
	padding: 1.25rem 2.25rem;
	width: 100%;

	:hover {
		background-color: #d8d8d8;
	}
`;

const CurrentUnitCSS = css`
	display: flex;
	justify-content: center;
	padding-right: 2rem;
	align-items: center;
`;

export const CurrentUnitButtonContainer = styled.button`
	${CurrentUnitCSS}
	color: ${(props) => props.theme.current.textColor};
`;

export const CurrentUnitDivContainer = styled.div`
	${CurrentUnitCSS}
	padding-right: 3.5rem;
`;

export const UnitsDropDownContainer = styled.ul`
	padding: 0;
	transform: translateX(-2.5rem) translateY(-4rem);
	background-color: white;
	overflow-y: scroll;
	max-height: 14rem;
	position: absolute;
	z-index: 2;
	border-radius: 8px;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
`;
