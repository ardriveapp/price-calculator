import type { ArDriveCommunityTip, ArToData, FiatToAr, UnitBoxes } from 'src/types';
import type { State } from './state';

export type Action =
	| { type: 'setArToData'; payload: ArToData }
	| { type: 'setArDriveCommunityTip'; payload: ArDriveCommunityTip }
	| { type: 'setFiatToAr'; payload: FiatToAr }
	| { type: 'setUnitBoxes'; payload: UnitBoxes };

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'setArToData':
			return {
				...state,
				arToData: action.payload
			};

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
		 * @TODO The unit boxes will be calculated together based off of any change
		 * to their values or current unit fields
		 *
		 * We'll add a calculation hook `useCalculate` that will be fired immediately
		 * upon unit change, and initially debounced when a value is changed
		 *
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
