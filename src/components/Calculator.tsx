import * as React from 'react';
import TextBox from './TextBox';
import FileComparison from './FileComparison';
import { CalculatorContainer, SolidDivider, DottedDivider } from './Calculator.style';
import PngIcon from './icons/PngIcon';
import MovIcon from './icons/MovIcon';
import Mp3Icon from './icons/Mp3Icon';
import DocIcon from './icons/DocIcon';
import useCalculation from '../hooks/useCalculation';
import { useStateValue } from '../state/state';
import convertUnit from '../utils/convert_unit';
import numberWithCommas from '../utils/number_with_commas';

export interface FileComparison {
	fileIcon: JSX.Element;
	comparisonText: string;
}

export default function Calculator(): JSX.Element {
	const [{ unitBoxes }] = useStateValue();

	useCalculation();

	const { value, currUnit } = unitBoxes.bytes;
	const currentBytes = convertUnit(value, currUnit, 'B');

	const pngCount = Math.round(currentBytes / (Math.pow(2, 20) * 2.5)); // 2.5 MB per picture
	const movCount = Math.round(currentBytes / (Math.pow(2, 20) * 100)); // 100 MB per minute
	const mp3Count = Math.round(currentBytes / (Math.pow(2, 20) * 1)); //     1 MB per minute
	const docCount = Math.round(currentBytes / (Math.pow(2, 10) * 300)); // 300 KB per doc

	const fileComparisons: [JSX.Element, string][] = [
		[PngIcon(), `That's like ~${numberWithCommas(pngCount)} pictures`],
		[MovIcon(), `plus ~${numberWithCommas(movCount)} minutes of video`],
		[Mp3Icon(), `and ~${numberWithCommas(mp3Count)} minutes of music`],
		[DocIcon(), `or even ~${numberWithCommas(docCount)} Word docs`]
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
