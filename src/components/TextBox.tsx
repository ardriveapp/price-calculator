import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import TextBoxUnitDropdown from './TextBoxUnitsDropdown';

interface TextBoxProps {
	input?: number;
	units: string[];
}

export default function TextBox({ input, units }: TextBoxProps): JSX.Element {
	return (
		<TextBoxContainer>
			<TextBoxInput type="text" name="textbox" value={input} />
			<TextBoxUnitDropdown onChange={(val) => console.log(val)} units={units}></TextBoxUnitDropdown>
		</TextBoxContainer>
	);
}
