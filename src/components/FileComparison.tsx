import * as React from 'react';
import { FileComparisonTypeIconContainer, FileComparisonContainer } from './FileComparison.style';

export default function FileComparison(): JSX.Element {
	return (
		<FileComparisonContainer>
			<FileComparisonTypeIconContainer></FileComparisonTypeIconContainer>
			<p>Lorem Ipsum</p>
		</FileComparisonContainer>
	);
}
