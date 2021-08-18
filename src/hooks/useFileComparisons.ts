import { useEffect, useState } from 'react';
import DocIcon from '../components/icons/DocIcon';
import MovIcon from '../components/icons/MovIcon';
import Mp3Icon from '../components/icons/Mp3Icon';
import PngIcon from '../components/icons/PngIcon';
import convertUnit from '../utils/convert_unit';
import numberWithCommas from '../utils/number_with_commas';
import type { BytesUnitBox } from '../types';

export default function useFileComparisons(currentByteUnitBox: BytesUnitBox): [JSX.Element, string][] {
	const { value, currUnit } = currentByteUnitBox;
	const [bytesToCalc, setBytesToCalc] = useState(convertUnit(value, currUnit, 'B'));

	useEffect(() => {
		// Only change displayed file comparison value when byte value changes
		// This is a fix for UI jitter on bytes currUnit change
		setBytesToCalc(convertUnit(value, currUnit, 'B'));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);

	const pngCount = Math.round(bytesToCalc / (Math.pow(2, 20) * 2.5)); // 2.5 MB per picture
	const movCount = Math.round(bytesToCalc / (Math.pow(2, 20) * 100)); // 100 MB per minute of video
	const mp3Count = Math.round(bytesToCalc / (Math.pow(2, 20) * 1)); //     1 MB per minute of music
	const docCount = Math.round(bytesToCalc / (Math.pow(2, 10) * 300)); // 300 KB per doc

	const fileComparisons: [JSX.Element, string][] = [
		[PngIcon(), `That's like ~${numberWithCommas(pngCount)} pictures`],
		[MovIcon(), `plus ~${numberWithCommas(movCount)} minutes of video`],
		[Mp3Icon(), `and ~${numberWithCommas(mp3Count)} minutes of music`],
		[DocIcon(), `or even ~${numberWithCommas(docCount)} Word docs`]
	];

	return fileComparisons;
}
