import * as React from 'react';
import TextBox from './TextBox';
import FileComparison from './FileComparison';
import { CalculatorContainer, SolidDivider, DashedDivider } from './Calculator.style';

export default function Calculator(): JSX.Element {
	return (
		<CalculatorContainer>
			<TextBox units={['KB', 'MB', 'GB']}></TextBox>
			<SolidDivider></SolidDivider>
			<TextBox units={['KB', 'MB', 'GB']}></TextBox>
			<DashedDivider>
				<FileComparison></FileComparison>
				<FileComparison></FileComparison>
				<FileComparison></FileComparison>
			</DashedDivider>
			<TextBox units={['KB', 'MB', 'GB']}></TextBox>
		</CalculatorContainer>
	);
}
