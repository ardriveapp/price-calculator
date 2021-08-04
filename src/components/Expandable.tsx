import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import DownArrowIcon from './icons/DownArrowIcon';
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
	margin: 0.5rem;
`;

const IconContainer = styled.div`
	padding-left: 1rem;
`;

interface ExpandableProps {
	title: string;
	description: string;
	hidden?: boolean;
}

export default function Expandable({ title, description }: ExpandableProps): JSX.Element {
	const [hidden, setHidden] = useState(true);

	return (
		<StyledExpandable>
			<StyledTitle onClick={() => setHidden(!hidden)}>
				{title}
				<IconContainer>
					<DownArrowIcon />
				</IconContainer>
			</StyledTitle>{' '}
			{!hidden && <p>{description}</p>}
		</StyledExpandable>
	);
}
