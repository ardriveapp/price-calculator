import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import { ArDriveCommunityTip, displayedByteUnitTypes, displayedFiatUnitTypes, UnitBoxes } from '../types';
import type { Action } from './reducer';

export type State = {
	/**
	 * ArDrive Community tip percentage and minimum community tip are to be read
	 * from the SmartWeave contract on startup, uses known defaults until data arrives
	 */
	arDriveCommunityTip: ArDriveCommunityTip;

	/** Current values and units for each field: 'bytes' | 'fiat' | 'ar' */
	unitBoxes: UnitBoxes;
};

/** ArDrive Price Calculator's initial state */
const initialState: State = {
	arDriveCommunityTip: {
		/** Default ArDrive Community Tip percentage */
		tipPercentage: 0.15,

		/** Default ArDrive Minimum Community Tip in Winston */
		minWinstonFee: 10_000_000
	},

	/** Unit boxes display only 1 GiB by default, other values to be filled in on first calculation */
	unitBoxes: {
		bytes: { value: 1, currUnit: 'GB', units: displayedByteUnitTypes },
		// Default -1 values here are to conditionally render input fields when data arrives
		fiat: { value: -1, currUnit: 'USD', units: displayedFiatUnitTypes },
		ar: { value: -1, currUnit: 'AR' }
	}
};

/** Create a context with initial state, and a dispatch function */
const StateContext = createContext<[State, Dispatch<Action>]>([initialState, () => initialState]);

/**
 *  Export easy to use context hook
 *
 *  @example
 *  const [{ arDriveCommunityTip }, dispatch] = useStateValue()
 *  dispatch({ type: 'setArDriveCommunityTip', payload: arDriveCommTipFromContract })
 */
export const useStateValue = (): [State, Dispatch<Action>] => useContext(StateContext);

type StateProviderProps = {
	reducer: React.Reducer<State, Action>;
	children: React.ReactNode;
};

/** Create provider to wrap app in */
export default function StateProvider({ reducer, children }: StateProviderProps): JSX.Element {
	const [state, dispatch] = useReducer(reducer, initialState);
	return <StateContext.Provider value={[state, dispatch]}>{children}</StateContext.Provider>;
}
