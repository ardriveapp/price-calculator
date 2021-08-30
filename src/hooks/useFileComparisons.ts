import { useEffect, useState } from 'react';
import DocIcon from '../components/icons/DocIcon';
import MovIcon from '../components/icons/MovIcon';
import Mp3Icon from '../components/icons/Mp3Icon';
import PngIcon from '../components/icons/PngIcon';
import convertUnit from '../utils/convert_unit';
import numberWithCommas from '../utils/number_with_commas';
import type { BytesUnitBox } from '../types';

// 2.5 MB per picture
const bytesPerPicture = Math.pow(2, 20) * 2.5;

// 100 MB per minute of video; 1 minute HD video for example value
const bytesPerVideo = Math.pow(2, 20) * 100;

// 1 MB per minute of music, 3 minute song for example value
const bytesPerSong = Math.pow(2, 20) * 1 * 3;

// 300 KB per doc
const bytesPerDoc = Math.pow(2, 10) * 300;

export default function useFileComparisons(
	currentByteUnitBox: BytesUnitBox
): [JSX.Element, [string, string, string]][] {
	const { value, currUnit } = currentByteUnitBox;
	const [bytesToCalc, setBytesToCalc] = useState(convertUnit(value, currUnit, 'B'));

	useEffect(() => {
		// Only change displayed file comparison value when byte value changes
		// This is a fix for UI jitter on bytes currUnit change
		setBytesToCalc(convertUnit(value, currUnit, 'B'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const pngCount = Math.round(bytesToCalc / bytesPerPicture);
	const movCount = Math.round(bytesToCalc / bytesPerVideo);
	const mp3Count = Math.round(bytesToCalc / bytesPerSong);
	const docCount = Math.round(bytesToCalc / bytesPerDoc);

	const fileComparisons: [JSX.Element, [string, string, string]][] = [
		[PngIcon(), ["That's like", `~${numberWithCommas(pngCount)}`, ' pictures']],
		[MovIcon(), ['Or', `~${numberWithCommas(movCount)}`, ' HD videos']],
		[Mp3Icon(), ['Or', `~${numberWithCommas(mp3Count)}`, ' songs']],
		[DocIcon(), ['Or even', `~${numberWithCommas(docCount)}`, ' office docs']]
	];

	return fileComparisons;
}
