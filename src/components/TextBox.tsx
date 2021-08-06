import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';
import type { UnitBoxes } from '../types';
import { useStateValue } from '../state/state';

interface TextBoxProps {
	input?: number;
	field: keyof UnitBoxes;
}

export default function TextBox({ input, field }: TextBoxProps): JSX.Element {
	const [{ unitBoxes }] = useStateValue();
	return (
		<TextBoxContainer>
			<TextBoxInput type="number" name="textbox" value={input} />
			<CurrentUnit
				onChange={(val) => console.log(val)}
				units={unitBoxes[field].units}
				currentUnit={unitBoxes[field].currUnit}
			></CurrentUnit>
		</TextBoxContainer>
	);
}
