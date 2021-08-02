import * as React from 'react';
import styled from 'styled-components';
const StyledExpandable = styled.div`
	border-bottom: 1px;
	border-color: black;
	border-bottom-style: solid;
	padding: 1rem;
`;

const StyledTitle = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 24px;
	margin: 0.5rem;
`;

const IconContainer = styled.div`
	padding-left: 1rem;
`;

interface ExpandableProps {
	title: string;
	description: string;
}

export default function Expandable({ title, description }: ExpandableProps): JSX.Element {
	return (
		<StyledExpandable>
			<StyledTitle>
				{title}
				<IconContainer>T</IconContainer>
			</StyledTitle>{' '}
			<p>{description}</p>
		</StyledExpandable>
	);
}
