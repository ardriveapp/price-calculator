import type { ArDriveCommunityTip } from 'ardrive-core-js';
import type { UnitBoxes } from '../types';
import type { State } from './state';

export type Action =
	| { type: 'setArDriveCommunityTip'; payload: ArDriveCommunityTip }
	| { type: 'setUnitBoxes'; payload: UnitBoxes }
	| { type: 'setFiatToARError' }
	| { type: 'clearFiatToARError' }
	| { type: 'setDataToARError' }
	| { type: 'clearDataToARError' };

export const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'setArDriveCommunityTip':
			return {
				...state,
				arDriveCommunityTip: action.payload
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

		case 'setFiatToARError':
			return {
				...state,
				oracleErrors: {
					...state.oracleErrors,
					fiatToAR: true
				}
			};

		case 'clearFiatToARError':
			return {
				...state,
				oracleErrors: {
					...state.oracleErrors,
					fiatToAR: false
				}
			};

		case 'setDataToARError':
			return {
				...state,
				oracleErrors: {
					...state.oracleErrors,
					dataToAR: true
				}
			};

		case 'clearDataToARError':
			return {
				...state,
				oracleErrors: {
					...state.oracleErrors,
					dataToAR: false
				}
			};

		default:
			return state;
	}
};
