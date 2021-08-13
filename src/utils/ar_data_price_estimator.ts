export interface ARDataPriceEstimator {
	getARPriceForByteCount: (byteCount: number) => Promise<number>;
	getByteCountForAR: (arPrice: number) => Promise<number>;
}
