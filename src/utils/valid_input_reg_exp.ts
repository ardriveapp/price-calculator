export const validInputRegExp = new RegExp('^[0-9]*[.]?[0-9]*$');

export default function isValidInput(input: string): boolean {
	return validInputRegExp.test(input);
}
