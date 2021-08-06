import * as React from 'react';
import { FileComparisonTypeIconContainer, FileComparisonContainer } from './FileComparison.style';
import DocIcon from './icons/DocIcon';
import MovIcon from './icons/MovIcon';
import Mp3Icon from './icons/Mp3Icon';
import PngIcon from './icons/PngIcon';

export default function FileComparison(): JSX.Element {
	return (
		<FileComparisonContainer>
			<FileComparisonTypeIconContainer>
				<PngIcon />
			</FileComparisonTypeIconContainer>
			<p>
				Lorem <span>Ipsum</span>
			</p>
		</FileComparisonContainer>
	);
}
