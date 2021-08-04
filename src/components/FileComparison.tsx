import * as React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	translate: -0.75rem;
`;

const IconContainer = styled.div`
	border-style: none;
	width: 1.5rem;
	height: 1.5rem;
	margin-right: 1rem;
	border-radius: 4px;
	background-color: #fafafa;
	box-shadow: 0 0 10px 5px rgba(213, 213, 213, 0.5);
`;

export default function FileComparison(): JSX.Element {
	return (
		<StyledContainer>
			<IconContainer></IconContainer>
			<p>Lorem Ipsum</p>
		</StyledContainer>
	);
}
