import styled, { css } from 'styled-components';

export const DropDownListItem = styled.button`
	padding: 1.25rem 2.25rem;
	width: 100%;
	color: ${(props) => props.theme.current.textColor};

	:hover {
		background-color: ${(props) => props.theme.current.dropdownHoverColor};
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
	background-color: ${(props) => props.theme.current.backgroundColor};
	overflow-y: scroll;
	max-height: 14rem;
	position: absolute;
	z-index: 2;
	border-radius: 8px;
	box-shadow: ${(props) => props.theme.current.boxShadow};
`;
