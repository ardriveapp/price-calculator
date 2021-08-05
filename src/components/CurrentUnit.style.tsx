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
	align-self: flex-start;
	background-color: white;
	overflow-y: scroll;
	max-height: 10rem;
	position: absolute;
	border-radius: 8px;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
`;
