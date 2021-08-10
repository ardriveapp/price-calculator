import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';
import type { UnitBox, UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import useDebounce from '../hooks/useDebounce';
import { useEffect } from 'react';
import { useState } from 'react';

interface TextBoxProps {
	input?: number;
	field: keyof UnitBoxes;
}

export default function TextBox({ field }: TextBoxProps): JSX.Element {
	const [{ unitBoxes }, dispatch] = useStateValue();

	const [localVal, setLocalVal] = useState(unitBoxes[field].value);

	const debouncedValue = useDebounce<number>(localVal, 1000);
	useEffect(() => {
		const newUnitBox: UnitBox = { ...unitBoxes[field], value: localVal };
		dispatch({ type: 'setUnitBoxes', payload: { ...unitBoxes, [field]: newUnitBox } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue]);

	return (
		<TextBoxContainer>
			<TextBoxInput
				type="number"
				name="textbox"
				value={localVal}
				onChange={(event) => +event.target.value > 0 && setLocalVal(+event.target.value)}
			/>
			<CurrentUnit units={unitBoxes[field].units} currentUnit={unitBoxes[field].currUnit}></CurrentUnit>
		</TextBoxContainer>
	);
}
