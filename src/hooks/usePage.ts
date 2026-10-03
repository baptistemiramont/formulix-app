import { useFilter } from "@/hooks/useFilter";

// Kept for the session, as the filters are: coming back to the list finds the page again
export const usePage = (
	storageKey: string
): [number, (page: number) => void] => {
	const [storedPage, setStoredPage] = useFilter(storageKey);

	function setPage(page: number): void {
		// The first page is the list as it opens: nothing to keep
		setStoredPage(page > 1 ? String(page) : "");
	}

	return [Math.max(1, Math.floor(Number(storedPage)) || 1), setPage];
};
