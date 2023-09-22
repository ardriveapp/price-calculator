import React, { useState } from 'react';
import Expandable from './Expandable';
import { faqQuestionsAnswers } from './Faq.content';
import { FaqContainer } from './Faq.style';

export default function Faq(): JSX.Element {
	const [expanded, setExpanded] = useState<number | undefined>(undefined);

	return (
		<FaqContainer>
			<h2 aria-label="Frequently asked questions">FAQs</h2>
			{faqQuestionsAnswers.map((qa, index) => (
				<Expandable
					key={qa.question}
					question={qa.question}
					answer={qa.answer}
					expanded={index === expanded}
					setExpanded={() =>
						index === expanded
							? setExpanded(undefined)
							: setExpanded(index)
					}
				></Expandable>
			))}
		</FaqContainer>
	);
}
