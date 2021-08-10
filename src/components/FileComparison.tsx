import * as React from 'react';
import { FileComparisonTypeIconContainer, FileComparisonContainer } from './FileComparison.style';

interface FileComparisonProps {
	fileIcon: JSX.Element;
	comparisonText: string;
}

export default function FileComparison({ fileIcon, comparisonText }: FileComparisonProps): JSX.Element {
	const indexOfTilde = comparisonText.indexOf('~');

	const wavehausBookComparisonText = comparisonText.substr(0, indexOfTilde - 1);
	const wavehausBoldComparisonText = comparisonText.substr(indexOfTilde);

	return (
		<FileComparisonContainer>
			<FileComparisonTypeIconContainer>{fileIcon}</FileComparisonTypeIconContainer>
			<p>
				{wavehausBookComparisonText} <span>{wavehausBoldComparisonText}</span>
			</p>
		</FileComparisonContainer>
	);
}
