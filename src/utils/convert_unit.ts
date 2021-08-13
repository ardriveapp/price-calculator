import type { ByteUnitType } from '../types';

const conversionRates = {
	B: 0,
	KB: 1,
	MB: 2,
	GB: 3
};

/**
 *
 * Converts byte count from a byte unit type into another byte unit type
 * Works with bytes, kilobytes, megabytes, and gigabytes. Measured in binary
 *
 * @param count number of bytes in the specified input byte unit type
 * @param inputUnit byte unit type for input count parameter
 * @param outputUnit byte unit type to be converted into
 * @returns byte count converted into the specified output unit
 *
 * @remarks Decimal count is not considered in this function
 */
export default function convertUnit(count: number, inputUnit: ByteUnitType, outputUnit: ByteUnitType): number {
	const inputPower = conversionRates[inputUnit] * 10;
	const outputPower = conversionRates[outputUnit] * 10;
	return count / Math.pow(2, outputPower - inputPower);
}
