import * as React from 'react';
import { FileComparisonTypeIconContainer, FileComparisonContainer } from './FileComparison.style';

interface FileComparisonProps {
	fileIcon: JSX.Element;
	comparisonText: string[];
}

export default function FileComparison({ fileIcon, comparisonText }: FileComparisonProps): JSX.Element {
	const wavehausBookComparisonText = comparisonText[0];
	const comparisonValue = comparisonText[1];
	const wavehausBoldComparisonText = comparisonText[2];

	return (
		<FileComparisonContainer>
			<FileComparisonTypeIconContainer>{fileIcon}</FileComparisonTypeIconContainer>
			<p>
				{wavehausBookComparisonText}{' '}
				<strong>
					<span>{comparisonValue}</span>
					{wavehausBoldComparisonText}
				</strong>
			</p>
		</FileComparisonContainer>
	);
}
