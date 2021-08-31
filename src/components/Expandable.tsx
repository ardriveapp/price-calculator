import * as React from 'react';
import { ExpandableContainer, ExpandableTitle, ExpandableTrailingIcon } from './Expandable.style';
import UpArrowIcon from './icons/UpArrowIcon';

interface ExpandableProps {
	title: string;
	description: React.ReactNode;
	expanded: boolean;
	setExpanded: () => void;
}

export default function Expandable({ title, description, expanded, setExpanded }: ExpandableProps): JSX.Element {
	return (
		<ExpandableContainer>
			<ExpandableTitle
				aria-label={expanded ? 'Hide answer' : 'Expand answer'}
				onClick={() => setExpanded()}
				expanded={expanded}
			>
				{title}
				<ExpandableTrailingIcon expanded={expanded}>
					<UpArrowIcon />
				</ExpandableTrailingIcon>
			</ExpandableTitle>{' '}
			{expanded && <>{description}</>}
		</ExpandableContainer>
	);
}
