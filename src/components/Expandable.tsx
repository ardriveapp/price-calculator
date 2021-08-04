import * as React from 'react';
import { ExpandableContainer, ExpandableTitle, ExpandableTrailingIcon } from './Expandable.style';
import DownArrowIcon from './icons/DownArrowIcon';

interface ExpandableProps {
	title: string;
	description: string;
	expanded: boolean;
	setExpanded: () => void;
}

export default function Expandable({ title, description, expanded, setExpanded }: ExpandableProps): JSX.Element {
	return (
		<ExpandableContainer>
			<ExpandableTitle onClick={() => setExpanded()}>
				{title}
				<ExpandableTrailingIcon>
					<DownArrowIcon />
				</ExpandableTrailingIcon>
			</ExpandableTitle>{' '}
			{expanded && <p>{description}</p>}
		</ExpandableContainer>
	);
}
