/** Returns spoken word if it exists on the abbreviation record, otherwise returns the abbreviation */
export function getSpokenWord(abbreviation: string): string {
	if (isAbbreviation(abbreviation)) {
		return abbreviationRecord[abbreviation];
	}

	return abbreviation;
}

const abbreviationRecord = {
	KB: 'kilobyte',
	MB: 'megabyte',
	GB: 'gigabyte',
	ETH: 'ethereum',
	BTC: 'bitcoin',
	USD: 'us dollar',
	JPY: 'japanese yen',
	EUR: 'euro'
};

function isAbbreviation(key: string): key is keyof typeof abbreviationRecord {
	return key in abbreviationRecord;
}
