import { useEffect, useState } from "react";

const HINT_DURATION_MS = 5000;

// A hint a tap leaves for a few seconds
export const useHint = (): [string | null, (hint: string | null) => void] => {
	const [hint, setHint] = useState<string | null>(null);

	useEffect(() => {
		if (!hint) return;

		const timeout = setTimeout(() => setHint(null), HINT_DURATION_MS);

		return () => clearTimeout(timeout);
	}, [hint]);

	return [hint, setHint];
};
