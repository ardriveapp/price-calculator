export class TurboRates {
	/**
	 * @param {number} winc winston credits for 1GB of data
	 * @param {FiatRates} fiatRates fiat required to purchase the given amount of winston credits
	 */
	constructor(readonly winc: number, readonly fiat: FiatRates) {}
}

export class FiatRates {
	constructor(
		readonly aud: number,
		readonly brl: number,
		readonly cad: number,
		readonly eur: number,
		readonly gbp: number,
		readonly hkd: number,
		readonly inr: number,
		readonly jpy: number,
		readonly sgd: number,
		readonly usd: number
	) {}
}
