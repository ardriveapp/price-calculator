import styled, { css } from 'styled-components';

export const DropDownListItem = styled.button`
	padding: 1rem;
`;

const CurrentUnitCSS = css`
	display: flex;
	justify-content: center;
	padding-right: 2rem;
	align-items: center;
`;

export const CurrentUnitButtonContainer = styled.button`
	${CurrentUnitCSS}
`;

export const CurrentUnitDivContainer = styled.div`
	${CurrentUnitCSS}
	padding-right: 3.5rem;
`;

export const UnitsDropDownContainer = styled.ul`
	padding: 1rem;
	transform: translateX(-1.5rem) translateY(-1rem);
	background-color: white;
	overflow-y: scroll;
	max-height: 10rem;
	position: absolute;
	z-index: 2;
	border-radius: 8px;
	transform: translateY(1.75rem);
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
`;
