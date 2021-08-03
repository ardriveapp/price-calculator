export interface ArDriveCommunityTip {
	tipPercentage: number;
	minWinstonTip: number;
}

export interface ArToData {
	winstonPerByte: number;
	baseFee: number;
}

export type FiatToAr = {
	// [FiatUnits in FiatUnitTypes]: number;
	[key: string]: number;
};

interface UnitBox {
	/** Value displayed on left on unit box */
	value: number;
	/** Current unit selected by the user */
	currUnit: string;
	/** All available units */
	units?: readonly string[];
}

export interface BytesUnitBox extends UnitBox {
	currUnit: ByteUnitTypes;
	units: readonly ByteUnitTypes[];
}

export interface FiatUnitBox extends UnitBox {
	currUnit: FiatUnitTypes;
	units: readonly FiatUnitTypes[];
}

export interface ArUnitBox extends UnitBox {
	currUnit: 'AR';
}

export const byteUnitTypes = ['KB', 'MB', 'GB'] as const;
export type ByteUnitTypes = typeof byteUnitTypes[number];

// prettier-ignore
export const fiatUnitTypes = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'IDR', 'TWD',
    'KRW', 'RUB', 'AED', 'ARS', 'AUD', 'BDT', 'BHD', 'BMD', 'BRL', 'CAD', 'CHF',
    'CLP', 'CZK', 'DKK', 'HKD', 'HUF', 'ILS', 'INR', 'KWD', 'LKR', 'MMK', 'MXN',
    'MYR', 'NGN', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'SAR', 'SEK', 'SGD', 'THB',
    'TRY', 'UAH', 'VEF', 'VND', 'ZAR', 'XDR', 'XAG','XAU'] as const;
export type FiatUnitTypes = typeof fiatUnitTypes[number];

export interface UnitBoxes {
	bytes: BytesUnitBox;
	fiat: FiatUnitBox;
	ar: ArUnitBox;
}
