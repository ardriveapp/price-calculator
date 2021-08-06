import { GatewayOracle } from 'ardrive-core-js';
import regression, { DataPoint } from 'regression';

export class Calculator {
	private static readonly sampleByteVolumes = [
		100000, // 100KB
		100000000, // 100MB
		10000000000 // 10GB
	];
	private sampleWinstonValues: number[] = [];
	private regressionInstance?: regression.Result;

	public async setup(): Promise<void> {
		await this.fetchData();
		this.runTheLinearRegression();
	}

	private async fetchData(): Promise<void> {
		const oracle = new GatewayOracle();
		const winstonSamplesQuery = Calculator.sampleByteVolumes.map((sampleByteCount) =>
			oracle.getWinstonPriceForByteCount(sampleByteCount)
		);
		const winstonSamplesResult = await Promise.all(winstonSamplesQuery);
		this.sampleWinstonValues = winstonSamplesResult;
	}

	private runTheLinearRegression(): void {
		const dataPoints: DataPoint[] = Calculator.sampleByteVolumes.map(
			(bytesCount, index) => [bytesCount, this.sampleWinstonValues[index]] as DataPoint
		);
		this.regressionInstance = regression.linear(dataPoints);
	}

	public getPriceForBytes(byteCount: number): number | undefined {
		return this.regressionInstance?.equation[byteCount];
	}
}
