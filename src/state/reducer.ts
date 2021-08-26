import type { ArDriveCommunityTip, FiatToAr, UnitBoxes } from '../types';
import type { State } from './state';

export type Action =
	| { type: 'setArDriveCommunityTip'; payload: ArDriveCommunityTip }
	| { type: 'setFiatToAr'; payload: FiatToAr }
	| { type: 'setUnitBoxes'; payload: UnitBoxes };

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'setArDriveCommunityTip':
			return {
				...state,
				arDriveCommunityTip: action.payload
			};

		case 'setFiatToAr':
			return {
				...state,
				fiatToArData: action.payload
			};

		/**
		 * The unit boxes are calculated together based off of any change
		 * to their `value` or `currUnit` fields with the `useCalculate` hook.
		 */
		case 'setUnitBoxes':
			return {
				...state,
				unitBoxes: action.payload
			};

		default:
			return state;
	}
};
