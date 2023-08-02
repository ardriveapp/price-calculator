import { ArDriveCommunityTip, W } from 'ardrive-core-js';
import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import {
	displayedByteUnitTypes,
	displayedArUnitTypes,
	displayedFiatUnitTypes,
	doNotRenderValue,
	OracleErrors,
	UnitBoxes
} from '../types';
import type { Action } from './reducer';

export type State = {
	/**
	 * ArDrive Community tip percentage and minimum community tip are hardcoded to their
	 * known values until a more efficient method of reading the contract is identified
	 */
	arDriveCommunityTip: ArDriveCommunityTip;
	turboFees: ArDriveCommunityTip;

	/** Current values and units for each field: 'bytes' | 'fiat' | 'ar' */
	unitBoxes: UnitBoxes;

	/** State for displaying errors from fiat and data oracles */
	oracleErrors: OracleErrors;
};

/** ArDrive Price Calculator's initial state */
const initialState: State = {
	arDriveCommunityTip: {
		/** Default ArDrive Community Tip percentage */
		tipPercentage: 0.15,

		/** Default ArDrive Minimum Community Tip in Winston */
		minWinstonFee: W(10_000_000)
	},
	turboFees: {
		tipPercentage: 0,
		minWinstonFee: W(0)
	},
	/** Unit boxes display only 1 GiB by default, other values to be filled in on first calculation */
	unitBoxes: {
		bytes: { value: 1, currUnit: 'GB', units: displayedByteUnitTypes },
		fiat: { value: doNotRenderValue, currUnit: 'USD', units: displayedFiatUnitTypes },
		ar: { value: doNotRenderValue, currUnit: 'AR', units: displayedArUnitTypes }
	},

	oracleErrors: {
		fiatToAR: false,
		dataToAR: false
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
