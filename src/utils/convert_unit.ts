import type { ByteUnitType } from '../types';

const conversionRates = {
	B: 0,
	KB: 1,
	MB: 2,
	GB: 3
};

/**
 * Converts byte count from a byte unit type into another byte unit type
 * Works with bytes, kilobytes, megabytes, and gigabytes. Measured in binary
 *
 * @param count number of byte units in the specified input byte unit type
 * @param inputUnit byte unit type for input count parameter
 * @param outputUnit byte unit type to be converted into
 *
 * @returns byte count converted into the specified output unit
 *
 * @throws when input byte unit is "B" (bytes) and specified count is a decimal
 */
export default function convertUnit(count: number, inputUnit: ByteUnitType, outputUnit: ByteUnitType): number {
	if (inputUnit === 'B' && !Number.isInteger(count)) {
		throw new Error('Input byte unit of "B" cannot be represented as a decimal!');
	}

	const inputPower = conversionRates[inputUnit] * 10;
	const outputPower = conversionRates[outputUnit] * 10;
	return count / Math.pow(2, outputPower - inputPower);
}
