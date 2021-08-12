const bytesPerKB = 1024;

const conversionRates = {
	KB: 1,
	MB: 2,
	GB: 3
};

/**
 * Converts bytes to AND from KB, MB, and GB.
 * By default, it will convert byteCount into the specified unit.
 *
 * @param toBytes set to true to convert from KB/MB/GB into bytes
 * @remarks Decimal count is not considered in this function
 */
export default function convertBytes(byteCount: number, unit: 'KB' | 'MB' | 'GB', toBytes = false): number {
	let timesToRun = conversionRates[unit];

	while (timesToRun) {
		if (toBytes) {
			byteCount *= bytesPerKB;
		} else {
			byteCount /= bytesPerKB;
		}
		timesToRun--;
	}

	return byteCount;
}
