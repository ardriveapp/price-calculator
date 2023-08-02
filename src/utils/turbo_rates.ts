export class TurboRates {
	/**
	 * @param {number} winc winston credits for 1GB of data
	 * @param fiat fiat required to purchase the given amount of winston credits
	 */
	constructor(readonly winc: number, readonly fiat: { [key: string]: number }) {}
}
