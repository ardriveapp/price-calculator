import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import { ArDriveCommunityTip, ArToData, byteUnitTypes, FiatToAr, fiatUnitTypes, UnitBoxes } from '../types';
import type { Action } from './reducer';

export type State = {
	/**
	 * To be fetched and then calculated by linear regression. If arToData
	 * remains undefined, the AR / Fiat input field should not be rendered
	 */
	arToData?: ArToData;

	/**
	 * ArDrive Community tip percentage and minimum community tip are to be read
	 * from the SmartWeave contract on startup, uses known defaults until data arrives
	 */
	arDriveCommunityTip: ArDriveCommunityTip;

	/** Fiat to AR conversions to be fetched from CoinGecko */
	fiatToArData?: FiatToAr;

	/** Current values and units for each field: 'bytes' | 'fiat' | 'ar' */
	unitBoxes: UnitBoxes;
};

/** ArDrive Price Calculator's initial state */
const initialState: State = {
	arDriveCommunityTip: {
		/** Default ArDrive Community Tip percentage */
		tipPercentage: 0.15,
		/** Default ArDrive Minimum Community Tip in winston */
		minWinstonTip: 10_000_000
	},

	/** Unit boxes display only 1 GiB by default, other values to be filled in on first calculation */
	unitBoxes: {
		bytes: { value: 1_073_742_000, currUnit: 'GB', units: byteUnitTypes },
		fiat: { value: 0, currUnit: 'USD', units: fiatUnitTypes },
		ar: { value: 0, currUnit: 'AR' }
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
