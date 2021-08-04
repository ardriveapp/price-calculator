import styled from 'styled-components';

export const DropDownList = styled.ul`
	list-style: none;
	margin: 1rem;
	align-self: center;
`;

export const DropDownListItem = styled.button`
	padding: 1rem;
	border: none;
`;

export const CurrentUnit = styled.button`
	border: none;
	font-size: inherit;
	background-color: inherit;
	pointer-events: auto;
	:hover {
	}
`;

export const UnitsDropDownContainer = styled.ul`
	padding: 1rem;
	background-color: white;
	overflow-y: scroll;
	max-height: 10rem;
	position: absolute;
	border-radius: 8px;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
`;
