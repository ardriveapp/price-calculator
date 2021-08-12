export interface FiatOracle {
	getUSDPriceForARAmount(ARAmount: number): Promise<number>;
}
