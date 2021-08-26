export const validInputRegExp = new RegExp('^[0-9]*[.]?[0-9]*$');

export default function isValidNumericUserInputString(input: string): boolean {
	return validInputRegExp.test(input);
}
