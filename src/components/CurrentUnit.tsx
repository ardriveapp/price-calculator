import React, { useState, useRef } from 'react';
import { ExpandableTrailingIcon } from './Expandable.style';

import {
	UnitsDropDownContainer,
	DropDownListItem,
	CurrentUnitButtonContainer,
	CurrentUnitDivContainer
} from './CurrentUnit.style';
import useOnOutsideClick from '../hooks/useOnOutsideClick';
import UpArrowIcon from './icons/UpArrowIcon';
import { useStateValue } from '../state/state';
import type { ByteUnitType } from '../types';
import { getSpokenWord } from '../utils/get_spoken_word';

interface CurrentUnitProps {
	units?: string[];
	currentUnit: string;
}

export default function CurrentUnit({ units, currentUnit }: CurrentUnitProps): JSX.Element {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const dropDownRef = useRef(null);
	useOnOutsideClick(dropDownRef, () => setDropdownOpen(false));

	if (units && units.length > 1) {
		return (
			<div ref={dropdownOpen ? dropDownRef : null}>
				<CurrentUnitButtonContainer
					onClick={() => setDropdownOpen(!dropdownOpen)}
					aria-label={`${dropdownOpen ? 'Close' : 'Open'} unit selector dropdown`}
				>
					<span>{currentUnit}</span>
					<ExpandableTrailingIcon expanded={dropdownOpen}>
						<UpArrowIcon />
					</ExpandableTrailingIcon>
				</CurrentUnitButtonContainer>
				{dropdownOpen && <UnitDropDown units={units} closeDropDown={() => setDropdownOpen(false)} />}
			</div>
		);
	}

	return (
		<CurrentUnitDivContainer>
			<span>{currentUnit}</span>
		</CurrentUnitDivContainer>
	);
}

interface UnitDropDownProps {
	units: string[];
	closeDropDown: () => void;
}

function UnitDropDown({ units, closeDropDown }: UnitDropDownProps): JSX.Element {
	const [{ unitBoxes }, dispatch] = useStateValue();

	const isFiatUnitBox = units === unitBoxes.fiat.units;

	function onUnitClick(unit: string): void {
		if (isFiatUnitBox && unit !== unitBoxes.fiat.currUnit) {
			dispatch({
				type: 'setUnitBoxes',
				payload: { ...unitBoxes, fiat: { ...unitBoxes.fiat, currUnit: unit } }
			});
		} else if (!isFiatUnitBox && unit !== unitBoxes.bytes.currUnit) {
			dispatch({
				type: 'setUnitBoxes',
				payload: { ...unitBoxes, bytes: { ...unitBoxes.bytes, currUnit: unit as ByteUnitType } }
			});
		}
		closeDropDown();
	}

	return (
		<UnitsDropDownContainer>
			{units.map((val) => (
				<li key={val}>
					<DropDownListItem
						aria-label={`Set current unit to ${getSpokenWord(val)}`}
						onClick={() => onUnitClick(val)}
					>
						{val}
					</DropDownListItem>
				</li>
			))}
		</UnitsDropDownContainer>
	);
}
