import { useEffect, useState } from "react";

import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from "@/utils/constants";

// The search sent to the API: once typing pauses, from a few letters, and cleared at once
export const useSearchQuery = (search: string): string => {
	const typedSearch = search.trim();
	const [searchQuery, setSearchQuery] = useState(typedSearch);

	useEffect(() => {
		const timeout = setTimeout(
			() => setSearchQuery(typedSearch),
			SEARCH_DEBOUNCE_MS
		);

		return () => clearTimeout(timeout);
	}, [typedSearch]);

	return typedSearch && searchQuery.length >= SEARCH_MIN_LENGTH
		? searchQuery
		: "";
};
