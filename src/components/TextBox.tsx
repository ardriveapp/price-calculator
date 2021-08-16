import * as React from 'react';
import { TextBoxContainer, TextBoxInput } from './TextBox.style';
import CurrentUnit from './CurrentUnit';
import type { UnitBox, UnitBoxes } from '../types';
import { useStateValue } from '../state/state';
import useDebounce from '../hooks/useDebounce';
import { useEffect } from 'react';
import { useState } from 'react';

interface TextBoxProps {
	field: keyof UnitBoxes;
}

export default function TextBox({ field }: TextBoxProps): JSX.Element {
	const [{ unitBoxes }, dispatch] = useStateValue();

	const [localInputValue, setLocalInputValue] = useState(unitBoxes[field].value);
	const [isDebouncing, setIsDebouncing] = useState(false);

	if (localInputValue !== unitBoxes[field].value && !isDebouncing) {
		// Calculation has been changed in the global state, set to new local value
		setLocalInputValue(unitBoxes[field].value);
	}

	/**
	 * Starts a debounce when local input is changed by user input
	 * debouncedValue will update when the debounce eventually settles
	 *
	 * Will skip the debounce if `!isDebouncing`. This allows the localInputValue
	 * to freely be changed by global state calculation without triggering debounces
	 */
	const debouncedValue = useDebounce<number>(localInputValue, isDebouncing, 1000);

	/** When debouncedValue has been changed, send new value to global state */
	useEffect(() => {
		const newUnitBox: UnitBox = { ...unitBoxes[field], value: debouncedValue };
		dispatch({ type: 'setUnitBoxes', payload: { ...unitBoxes, [field]: newUnitBox } });
		setIsDebouncing(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue]);

	/** Initially hides fiat and AR inputs until data arrives and first calculation has settled */
	const hideInput: React.CSSProperties = { visibility: unitBoxes[field].value !== -1 ? 'visible' : 'hidden' };

	return (
		<TextBoxContainer>
			<TextBoxInput
				style={hideInput}
				type="number"
				name="textbox"
				value={localInputValue}
				onChange={(event) => {
					setIsDebouncing(true);
					setLocalInputValue(Math.abs(Number(event.target.value)));
				}}
			/>
			<CurrentUnit units={unitBoxes[field].units} currentUnit={unitBoxes[field].currUnit}></CurrentUnit>
		</TextBoxContainer>
	);
}
