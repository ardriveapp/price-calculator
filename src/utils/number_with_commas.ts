/**
 * Adds commas to longer integers for a more visually appealing display
 *
 * @throws on non-integer values represented as a decimal
 *
 * @example
 *
 * const num = numberWithCommas(10_000_000);
 * console.log(num); // result is '10,000,000'
 */
export default function numberWithCommas(x: number): string {
	if (!Number.isInteger(x)) {
		throw new Error('Value must be a non-decimal integer to add commas!');
	}
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
