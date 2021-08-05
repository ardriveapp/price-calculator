import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';

interface TextBoxProps {
	input?: number;
	units: string[];
}

export default function TextBox({ input, units }: TextBoxProps): JSX.Element {
	return (
		<TextBoxContainer>
			<TextBoxInput type="text" name="textbox" value={input} />
			<CurrentUnit onChange={(val) => console.log(val)} units={units}></CurrentUnit>
		</TextBoxContainer>
	);
}
