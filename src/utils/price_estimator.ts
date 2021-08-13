export interface PriceEstimator {
	getARPriceForByteCount: (byteCount: number) => Promise<number>;
	getByteCountForAR: (arPrice: number) => Promise<number>;
}
