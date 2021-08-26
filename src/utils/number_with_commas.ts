/**
 * Adds commas to longer integers for a more visually appealing display
 *
 * @remarks Rounds non-integers to thousandths, ex: `1.0005` becomes `1.001`
 * @remarks Solution found from this SO answer: https://stackoverflow.com/a/17663871
 *
 * @example
 * const value: string = numberWithCommas(10_000_000);
 * console.log(value); // Result is '10,000,000'
 */
export default function numberWithCommas(x: number, locales?: string | string[]): string {
	return x.toLocaleString(locales);
}
