import { currencyIDs } from './utils/fiat_oracle_types';

export interface ArDriveCommunityTip {
	tipPercentage: number;
	minWinstonFee: number;
}

export interface UnitBox {
	/** Value displayed on left on unit box */
	value: number;
	/** Current unit selected by the user */
	currUnit: string;
	/** All available units */
	units?: string[];
}

export interface BytesUnitBox extends UnitBox {
	currUnit: ByteUnitType;
	units: ByteUnitType[];
}

export interface FiatUnitBox extends UnitBox {
	currUnit: FiatUnitType;
	units: FiatUnitType[];
}

export interface ArUnitBox extends UnitBox {
	currUnit: 'AR';
}

export type ByteUnitType = 'B' | 'KB' | 'MB' | 'GB';
export const displayedByteUnitTypes: ByteUnitType[] = ['KB', 'MB', 'GB'];

/** Fiat unit types are translated from the coingecko supported currencies  */
export const displayedFiatUnitTypes = currencyIDs.map((f) => f.toUpperCase());

export type FiatUnitType = typeof displayedFiatUnitTypes[number];

export interface UnitBoxes {
	bytes: BytesUnitBox;
	fiat: FiatUnitBox;
	ar: ArUnitBox;
}
