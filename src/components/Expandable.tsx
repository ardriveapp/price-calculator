import * as React from 'react';
import { ExpandableContainer, ExpandableTitle, ExpandableTrailingIcon } from './Expandable.style';
import UpArrowIcon from './icons/UpArrowIcon';

interface ExpandableProps {
	question: string;
	answer: React.ReactNode;
	expanded: boolean;
	setExpanded: () => void;
}

export default function Expandable({ question, answer, expanded, setExpanded }: ExpandableProps): JSX.Element {
	return (
		<ExpandableContainer>
			<ExpandableTitle aria-label={question} onClick={() => setExpanded()} expanded={expanded}>
				<h3>{question}</h3>
				<ExpandableTrailingIcon expanded={expanded}>
					<UpArrowIcon />
				</ExpandableTrailingIcon>
			</ExpandableTitle>{' '}
			{expanded && <>{answer}</>}
		</ExpandableContainer>
	);
}
