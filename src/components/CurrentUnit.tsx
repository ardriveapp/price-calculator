import * as React from 'react';
import { useState } from 'react';
import { ExpandableTrailingIcon } from './Expandable.style';
import DownArrowIcon from './icons/DownArrowIcon';
import { CurrentUnitContainer, UnitsDropDownContainer, DropDownListItem } from './CurrentUnit.style';

interface CurrentUnitProps {
	units: string[];
	onChange: (input: string) => void;
}

export default function CurrentUnit({ units }: CurrentUnitProps): JSX.Element {
	const [hidden, setHidden] = useState(false);
	return (
		<CurrentUnitContainer onClick={() => setHidden(!hidden)}>
			<span>MB</span>
			<ExpandableTrailingIcon>
				<DownArrowIcon />
			</ExpandableTrailingIcon>
			{hidden && units.length > 1 && <UnitDropDown units={units} />}
		</CurrentUnitContainer>
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
					<DropDownListItem onClick={() => console.log(val)}>{val}</DropDownListItem>
				</li>
			))}
		</UnitsDropDownContainer>
	);
}
