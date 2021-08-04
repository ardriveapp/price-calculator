import * as React from 'react';
import { useState } from 'react';
import { ExpandableContainer, ExpandableTitle, ExpandableTrailingIcon } from './Expandable.style';
import DownArrowIcon from './icons/DownArrowIcon';

interface ExpandableProps {
	title: string;
	description: string;
	hidden?: boolean;
}

export default function Expandable({ title, description }: ExpandableProps): JSX.Element {
	const [hidden, setHidden] = useState(true);

	return (
		<ExpandableContainer>
			<ExpandableTitle onClick={() => setHidden(!hidden)}>
				{title}
				<ExpandableTrailingIcon>
					<DownArrowIcon />
				</ExpandableTrailingIcon>
			</ExpandableTitle>{' '}
			{!hidden && <p>{description}</p>}
		</ExpandableContainer>
	);
}
