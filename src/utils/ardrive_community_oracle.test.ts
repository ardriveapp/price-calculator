import { expect } from 'chai';
import { stub } from 'sinon';
import { minArDriveCommunityARTip } from './constants';
import { ArDriveCommunityOracle, communityTipBlockHeight } from './ardrive_community_oracle';
import type { ContractOracle } from './contract_oracle';
import { stubInterface } from 'ts-sinon';

describe('The ArDriveCommunityOracle class', () => {
	describe('`getArDriveTipPercentage` function', () => {
		it('returns a decimal to be used as a percentage', async () => {
			const smartWeaveOracleStub = stubInterface<ContractOracle>();

			smartWeaveOracleStub.getCommunityTipSetting.callsFake(() => Promise.resolve(123));

			const output = await new ArDriveCommunityOracle().getArDriveTipPercentage(smartWeaveOracleStub);

			expect(output).to.equal(1.23);
			expect(smartWeaveOracleStub.getCommunityTipSetting.calledOnceWithExactly(communityTipBlockHeight)).to.be
				.true;

			return;
		});

		it('will return `cachedArDriveTipPercentage` if it has been defined', async () => {
			const smartWeaveOracleStub = stubInterface<ContractOracle>();

			const arDriveCommunityOracle = new ArDriveCommunityOracle();
			arDriveCommunityOracle.cachedArDriveTipPercentage = 1;
			const output = await arDriveCommunityOracle.getArDriveTipPercentage(smartWeaveOracleStub);

			expect(output).to.equal(1);
			expect(smartWeaveOracleStub.getCommunityTipSetting.notCalled).to.be.true;

			return;
		});

		it('will not overwrite `cachedArDriveTipPercentage` if it has already been defined during the async call', async () => {
			const smartWeaveOracleStub = stubInterface<ContractOracle>();
			smartWeaveOracleStub.getCommunityTipSetting.callsFake(() => Promise.resolve(123));

			const arDriveCommunityOracle = new ArDriveCommunityOracle();

			// Non-awaited call to trigger gathering percentage
			const promiseFromInitialCall = arDriveCommunityOracle.getArDriveTipPercentage(smartWeaveOracleStub);

			// Cached percentage still undefined, getArDriveTipPercentage has not finished
			expect(arDriveCommunityOracle.cachedArDriveTipPercentage).to.be.undefined;

			// Set tip in cache still during async call
			arDriveCommunityOracle.cachedArDriveTipPercentage = 2;

			// Initial call has returned with manually set cached percentage, not the stubbed 123 response
			expect(await promiseFromInitialCall).to.equal(2);

			// Ensure `getCommunityTipSetting` was called only once
			expect(smartWeaveOracleStub.getCommunityTipSetting.calledOnceWithExactly(communityTipBlockHeight)).to.be
				.true;

			return;
		});
	});

	describe('`setExactTipSettingInBackground` function', () => {
		it('returns a decimal to be used as a percentage', async () => {
			const smartWeaveOracleStub = stubInterface<ContractOracle>();

			smartWeaveOracleStub.getCommunityTipSetting.callsFake(() => Promise.resolve(567));

			const output = await new ArDriveCommunityOracle().setExactTipSettingInBackground(smartWeaveOracleStub);

			expect(output).to.equal(5.67);
			expect(smartWeaveOracleStub.getCommunityTipSetting.calledOnceWithExactly()).to.be.true;

			return;
		});

		it('will return `cachedArDriveTipPercentage` if it has been defined and `isCommTipFromExactSettings` is true', async () => {
			const smartWeaveOracleStub = stubInterface<ContractOracle>();
			const arDriveCommunityOracle = new ArDriveCommunityOracle();

			arDriveCommunityOracle.cachedArDriveTipPercentage = 1;
			arDriveCommunityOracle.isCommTipFromExactSettings = true;

			const output = await arDriveCommunityOracle.setExactTipSettingInBackground(smartWeaveOracleStub);

			expect(output).to.equal(1);
			expect(smartWeaveOracleStub.getCommunityTipSetting.notCalled).to.be.true;

			return;
		});
	});

	describe('`getCommunityARTip` function', () => {
		it('returns the `minArDriveCommunityARTip` if the calculated community tip is a smaller value', async () => {
			const arDriveCommunityOracle = new ArDriveCommunityOracle();

			const getArDriveTipSpy = stub(arDriveCommunityOracle, 'getArDriveTipPercentage').callsFake(() =>
				Promise.resolve(1)
			);

			const output = await arDriveCommunityOracle.getCommunityARTip(minArDriveCommunityARTip - 0.000_000_000_001);

			expect(output).to.equal(minArDriveCommunityARTip);
			expect(getArDriveTipSpy.calledOnce).to.be.true;

			return;
		});

		it('returns the calculated community tip value if it is larger than `minArDriveCommunityARTip`', async () => {
			const arDriveCommunityOracle = new ArDriveCommunityOracle();

			const getArDriveTipSpy = stub(arDriveCommunityOracle, 'getArDriveTipPercentage').callsFake(() =>
				Promise.resolve(1)
			);

			const input = minArDriveCommunityARTip + 0.000_000_000_001;
			const output = await arDriveCommunityOracle.getCommunityARTip(input);

			expect(output).to.equal(input);
			expect(getArDriveTipSpy.calledOnce).to.be.true;

			return;
		});
	});
});
