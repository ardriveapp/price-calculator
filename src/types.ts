export interface ArDriveCommunityTip {
	tipPercentage: number;
	minWinstonFee: number;
}

export type FiatToAr = {
	// [FiatUnits in FiatUnitTypes]: number;
	[key: string]: number;
};

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

// prettier-ignore
export const displayedFiatUnitTypes = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'IDR',
    'TWD', 'KRW', 'RUB', 'AED', 'ARS', 'AUD', 'BDT', 'BHD', 'BMD', 'BRL', 'CAD',
		'CHF', 'CLP', 'CZK', 'DKK', 'HKD', 'HUF', 'ILS', 'INR', 'KWD', 'LKR', 'MMK',
		'MXN', 'MYR', 'NGN', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'SAR', 'SEK', 'SGD',
		'THB', 'TRY', 'UAH', 'VEF', 'VND', 'ZAR', 'XDR', 'XAG', 'XAU'];
export type FiatUnitType = typeof displayedFiatUnitTypes[number];

export interface UnitBoxes {
	bytes: BytesUnitBox;
	fiat: FiatUnitBox;
	ar: ArUnitBox;
}
