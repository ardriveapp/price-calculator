import * as React from 'react';
import TextBox from './TextBox';
import FileComparison from './FileComparison';
import { CalculatorContainer, SolidDivider, DottedDivider } from './Calculator.style';

export default function Calculator(): JSX.Element {
	return (
		<CalculatorContainer>
			<TextBox units={['KB', 'MB', 'GB']}></TextBox>
			<SolidDivider></SolidDivider>
			<TextBox units={['KB', 'MB', 'GB']}></TextBox>
			<DottedDivider>
				<FileComparison></FileComparison>
				<FileComparison></FileComparison>
				<FileComparison></FileComparison>
			</DottedDivider>
			<TextBox units={['KB', 'MB', 'GB']}></TextBox>
		</CalculatorContainer>
	);
}
