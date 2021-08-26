import { useEffect } from 'react';

function useDebounce(
	value: number,
	runDebounce = true,
	dispatchValueToState: (value: number) => void,
	delay = 1000
): void {
	useEffect(() => {
		if (!runDebounce) {
			// Escape debounce, don't update value
			return;
		}

		const timer = setTimeout(() => {
			dispatchValueToState(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, delay]);
}

export default useDebounce;
