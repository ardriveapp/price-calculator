import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, runDebounce = true, delay?: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		if (!runDebounce) {
			// Escape debounce, don't update value
			return;
		}

		const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

		return () => {
			clearTimeout(timer);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
