import * as React from 'react';
import TextBox from './TextBox';
import FileComparison from './FileComparison';
import { CalculatorContainer, SolidDivider, DottedDivider } from './Calculator.style';
import PngIcon from './icons/PngIcon';
import MovIcon from './icons/MovIcon';
import Mp3Icon from './icons/Mp3Icon';
import DocIcon from './icons/DocIcon';

export interface FileComparison {
	fileIcon: JSX.Element;
	comparisonText: string;
}

export default function Calculator(): JSX.Element {
	/** @TODO Read current `bytes.value` from state management */
	const currentBytes = 500000;

	/** @TODO Get real file sizes fir .mov | .png | .mp3 | .doc */
	const pngCount = Math.round(currentBytes / 50000);
	const movCount = Math.round(currentBytes / 100000);
	const mp3Count = Math.round(currentBytes / 80000);
	const docCount = Math.round(currentBytes / 20000);

	const fileComparisons: [JSX.Element, string][] = [
		[PngIcon(), `That's like ~${pngCount} pictures`],
		[MovIcon(), `plus ~${movCount} videos`],
		[Mp3Icon(), `and ~${mp3Count} songs`],
		[DocIcon(), `or even ~${docCount} Word docs`]
	];

	return (
		<CalculatorContainer>
			<TextBox field={'fiat'}></TextBox>
			<SolidDivider></SolidDivider>
			<TextBox field={'bytes'}></TextBox>
			<DottedDivider>
				{fileComparisons.map((fileComparison) => (
					<FileComparison
						key={fileComparison[1]}
						fileIcon={fileComparison[0]}
						comparisonText={fileComparison[1]}
					/>
				))}
			</DottedDivider>
			<TextBox field={'ar'}></TextBox>
		</CalculatorContainer>
	);
}
