import { useState } from "react";

function getStoredFilter(storageKey: string): string {
	try {
		return sessionStorage.getItem(storageKey) ?? "";
	} catch {
		return "";
	}
}

// Kept for the session: coming back to the list finds the filter again, opening the app anew starts without it
export const useFilter = (
	storageKey: string
): [string, (filter: string) => void] => {
	const [filter, setFilterState] = useState(() =>
		getStoredFilter(storageKey)
	);

	function setFilter(nextFilter: string): void {
		try {
			if (nextFilter) {
				sessionStorage.setItem(storageKey, nextFilter);
			} else {
				sessionStorage.removeItem(storageKey);
			}
		} catch {
			// Storage unavailable: the filter only lasts until the list is left.
		}

		setFilterState(nextFilter);
	}

	return [filter, setFilter];
};
