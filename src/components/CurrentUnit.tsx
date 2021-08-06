import React, { useState, useRef } from 'react';
import { ExpandableTrailingIcon } from './Expandable.style';
import DownArrowIcon from './icons/DownArrowIcon';
import {
	UnitsDropDownContainer,
	DropDownListItem,
	CurrentUnitButtonContainer,
	CurrentUnitDivContainer
} from './CurrentUnit.style';
import useOnOutsideClick from '../hooks/useOnOutsideClick';

interface CurrentUnitProps {
	units?: string[];
	currentUnit?: string;
	onChange: (input: string) => void;
}

export default function CurrentUnit({ units, currentUnit }: CurrentUnitProps): JSX.Element {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	if (units && units?.length > 1) {
		return (
			<CurrentUnitButtonContainer
				onClick={() => setDropdownOpen(!dropdownOpen)}
				aria-label={`${dropdownOpen ? 'Close' : 'Open'} unit selector dropdown`}
			>
				<span>{currentUnit}</span>
				<ExpandableTrailingIcon>
					<DownArrowIcon />
				</ExpandableTrailingIcon>
				{dropdownOpen && <UnitDropDown closeDropdown={() => setDropdownOpen(false)} units={units} />}
			</CurrentUnitButtonContainer>
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
	closeDropdown: () => void;
}

function UnitDropDown({ units, closeDropdown }: UnitDropDownProps): JSX.Element {
	const dropDownRef = useRef(null);
	useOnOutsideClick(dropDownRef, () => closeDropdown());

	return (
		<UnitsDropDownContainer ref={dropDownRef}>
			{units.map((val) => (
				<li key={val}>
					<DropDownListItem aria-label="Set current unit" onClick={() => console.log(val)}>
						{val}
					</DropDownListItem>
				</li>
			))}
		</UnitsDropDownContainer>
	);
}
