import { expect } from 'chai';
import { SinonStubbedInstance, stub } from 'sinon';
import type { UnitBoxValues } from 'src/hooks/useCalculation';
import { ARDataPriceRegressionEstimator } from './ar_data_price_regression_estimator';
import { UnitBoxCalculator } from './calculate_unit_boxes';
import type { ARDataPriceEstimator } from './ar_data_price_estimator';

describe('UnitBoxCalculator class', () => {
	let unitBoxCalculator: UnitBoxCalculator;
	let stubbedPriceEstimator: SinonStubbedInstance<ARDataPriceEstimator>;

	const fiatPerAr = 10;
	const expectedResult: UnitBoxValues = { bytes: 1, fiat: 10, ar: 1 };

	before(() => {
		stubbedPriceEstimator = stub(new ARDataPriceRegressionEstimator(true));
		stubbedPriceEstimator.getByteCountForAR.callsFake(() => Promise.resolve(Math.pow(2, 10)));
		stubbedPriceEstimator.getARPriceForByteCount.callsFake(() => Promise.resolve(1));
		unitBoxCalculator = new UnitBoxCalculator(stubbedPriceEstimator);
	});

	it('calculateUnitBoxValues function returns the correct unitBoxes when using the bytes unit to calculate', async () => {
		const actual = await unitBoxCalculator.calculateUnitBoxValues(1, 'bytes', fiatPerAr, 'KB');
		expect(actual).to.deep.equal(expectedResult);
	});

	it('calculateUnitBoxValues function returns the correct unitBoxes when using the fiat unit to calculate', async () => {
		const actual = await unitBoxCalculator.calculateUnitBoxValues(10, 'fiat', fiatPerAr, 'KB');
		expect(actual).to.deep.equal(expectedResult);
	});

	it('calculateUnitBoxValues function returns the correct unitBoxes when using the ar unit to calculate', async () => {
		const actual = await unitBoxCalculator.calculateUnitBoxValues(1, 'ar', fiatPerAr, 'KB');
		expect(actual).to.deep.equal(expectedResult);
	});
});
