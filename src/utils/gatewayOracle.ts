import fetch from 'node-fetch';

export class GatewayOracle {
	async getAllWinstonPricesForByteCounts(byteCounts: Array<number>): Promise<Array<number>> {
		const allPrices = byteCounts.map((byteCount) => this.getWinstonPriceForByteCount(byteCount));
		return Promise.all(allPrices);
	}

	async getWinstonPriceForByteCount(byteCount: number): Promise<number> {
		const response = await fetch(`https://arweave.net/price/${byteCount}`);
		const winstonAsString = await response.text();
		const winstonAsNumber = Number(winstonAsString);
		return winstonAsNumber;
	}
}
