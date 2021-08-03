import { useStateValue } from '../state/state';
import React, { CSSProperties } from 'react';
import type { UnitBoxes } from '../types';

interface UnitBoxProps {
	field: keyof UnitBoxes;
}

/**
 * This is a temporary component that was made for testing the state
 * management setup. The pattern used here will be integrated into the
 * statically framed elements during the upcoming AR -> Data ticket
 */
export function UnitBox({ field }: UnitBoxProps): JSX.Element {
	const [{ unitBoxes }, dispatch] = useStateValue();

	const style: CSSProperties = { textAlign: 'center', padding: '0.6rem', fontSize: '1rem' };
	const bigFontStyle: CSSProperties = { ...style, fontSize: '2rem' };

	return (
		<div style={style}>
			<div style={bigFontStyle}>value: {unitBoxes[field].value}</div>
			<div style={style}>currUnit: {unitBoxes[field].currUnit}</div>
			<button
				style={style}
				onClick={() =>
					dispatch({
						type: 'setUnitBoxes',
						payload: {
							...unitBoxes,
							[field]: { ...unitBoxes[field], value: Math.floor(Math.random() * 1000) }
						}
					})
				}
			>
				randomize {field} unit box
			</button>
		</div>
	);
}
