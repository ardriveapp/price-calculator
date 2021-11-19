import { currencyIDs } from './utils/fiat_oracle_types';

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

const currenciesFromOracle = currencyIDs.map((f) => f.toUpperCase());

const currenciesNotToDisplay = [
	'XDR',
	'XAG',
	'XAU',
	'BITS',
	'SATS',
	'LTC',
	'BCH',
	'BNB',
	'EOS',
	'XRP',
	'XLM',
	'LINK',
	'DOT',
	'YFI'
];

/** Fiat unit types translated from the coingecko supported currencies */
export const displayedFiatUnitTypes = currenciesFromOracle.filter((f) => !currenciesNotToDisplay.includes(f));

export type FiatUnitType = typeof displayedFiatUnitTypes[number];

export interface UnitBoxes {
	bytes: BytesUnitBox;
	fiat: FiatUnitBox;
	ar: ArUnitBox;
}

export interface OracleErrors {
	fiatToAR: boolean;
	dataToAR: boolean;
}

/** Unit boxes will not render values when set to -1 */
export const doNotRenderValue = -1;
