import { GatewayOracle } from './gateway_oracle';
import type { ArweaveOracle } from './arweave_oracle';
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

	private hasData = false;
	private isSyncing = false;
	private setupPromise?: Promise<void>;

	constructor(doNotSetup = false, private oracle: ArweaveOracle = new GatewayOracle()) {
		if (!doNotSetup) {
			this.setup();
		}
	}

	private async setup(): Promise<void> {
		if (this.isSyncing) {
			return this.setupPromise;
		}
		if (!this.hasData) {
			this.isSyncing = true;
			const workerPromise = this.setupWorker();
			this.setupPromise = workerPromise;
			await workerPromise;
			this.isSyncing = false;
			this.setupPromise = undefined;
		}
		this.hasData = true;
	}

	private async setupWorker(): Promise<void> {
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

	public async getPriceForBytes(byteCount: number): Promise<number | undefined> {
		await this.setup();
		const predictedPoint = this.regressionInstance?.predict(byteCount);
		const predictedValue = predictedPoint && predictedPoint[1];
		return predictedValue;
	}
}
