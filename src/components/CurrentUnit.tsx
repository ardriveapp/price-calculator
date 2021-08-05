import * as React from 'react';
import { useState } from 'react';
import { ExpandableTrailingIcon } from './Expandable.style';
import DownArrowIcon from './icons/DownArrowIcon';
import {
	UnitsDropDownContainer,
	DropDownListItem,
	CurrentUnitButtonContainer,
	CurrentUnitDivContainer
} from './CurrentUnit.style';

interface CurrentUnitProps {
	units: string[];
	onChange: (input: string) => void;
}

export default function CurrentUnit({ units }: CurrentUnitProps): JSX.Element {
	const [hidden, setHidden] = useState(true);

	if (units.length > 1) {
		return (
			<CurrentUnitButtonContainer
				onClick={() => setHidden(!hidden)}
				aria-label={`${hidden ? 'Open' : 'Close'} unit selector dropdown`}
			>
				<span>MB</span>
				<ExpandableTrailingIcon>
					<DownArrowIcon />
				</ExpandableTrailingIcon>
				{!hidden && <UnitDropDown units={units} />}
			</CurrentUnitButtonContainer>
		);
	}

	return (
		<CurrentUnitDivContainer>
			<span>AR</span>
		</CurrentUnitDivContainer>
	);
}

interface UnitDropDownProps {
	units: string[];
}

function UnitDropDown({ units }: UnitDropDownProps): JSX.Element {
	return (
		<UnitsDropDownContainer>
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
