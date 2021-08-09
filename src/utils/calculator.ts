import { GatewayOracle } from 'ardrive-core-js';
import type { ArweaveOracle } from 'ardrive-core-js/lib/arweave_oracle';
import regression, { DataPoint } from 'regression';

const SET = 'SET';

export class Calculator {
	private static readonly sampleByteVolumes = [
		102_400, // 100 KiB
		104_857_600, // 100 MiB
		107_374_182_400 // 10 GiB
	];
	private sampleWinstonValues: number[] = [];
	private regressionInstance?: regression.Result;

	constructor(doNotSetup = false, private oracle: ArweaveOracle = new GatewayOracle()) {
		if (!doNotSetup) {
			this.setup();
		}
	}

	private async setup(): Promise<void> {
		await this.fetchData();
		this.runTheLinearRegression();
	}

	private async fetchData(): Promise<void> {
		const winstonSamplesQuery = Calculator.sampleByteVolumes.map((sampleByteCount) =>
			this.oracle.getWinstonPriceForByteCount(sampleByteCount)
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
		const predictedPoint = this.regressionInstance?.predict(byteCount);
		const predictedValue = predictedPoint && predictedPoint[1];
		return predictedValue;
	}
}
