import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
	window.addEventListener("online", onChange);
	window.addEventListener("offline", onChange);

	return () => {
		window.removeEventListener("online", onChange);
		window.removeEventListener("offline", onChange);
	};
}

// Whether the device has a connection: offline for sure when false, though not always reaching the API when true
export const useIsOnline = (): boolean =>
	useSyncExternalStore(subscribe, () => navigator.onLine);
