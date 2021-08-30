import React, { useState } from 'react';
import Expandable from './Expandable';
import { faqQuestionsAnswers } from './Faq.content';
import { FaqContainer, VersionNumber } from './Faq.style';

export default function Faq(): JSX.Element {
	const [expanded, setExpanded] = useState<number | undefined>(undefined);

	return (
		<FaqContainer>
			<h2>FAQs</h2>
			{faqQuestionsAnswers.map((qa, index) => (
				<Expandable
					key={qa.question}
					title={qa.question}
					description={qa.answer}
					expanded={index === expanded}
					setExpanded={() => (index === expanded ? setExpanded(undefined) : setExpanded(index))}
				></Expandable>
			))}
			<VersionNumber>v{import.meta.env.SNOWPACK_PUBLIC_VERSION}</VersionNumber>
		</FaqContainer>
	);
}
