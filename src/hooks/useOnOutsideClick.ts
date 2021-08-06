import { RefObject, useEffect } from 'react';

type AnyEvent = MouseEvent | TouchEvent;

export default function useOnOutsideClick<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	handler: (event: AnyEvent) => void
): void {
	useEffect(() => {
		const listener = (event: AnyEvent) => {
			const elementTouched = ref?.current;

			// Do nothing if clicking ref's element or descendent elements
			if (!elementTouched || elementTouched.contains(event.target as Node)) {
				return;
			}

			handler(event);
		};

		document.addEventListener(`mousedown`, listener);
		document.addEventListener(`touchstart`, listener);

		return () => {
			// Cleanup listeners on component un-mount
			document.removeEventListener(`mousedown`, listener);
			document.removeEventListener(`touchstart`, listener);
		};

		// Reload only if ref or handler changes
	}, [ref, handler]);
}
