import { useEffect, useState } from "react";

import { THEME_COLORS, THEME_STORAGE_KEY } from "@/utils/constants";

export type TTheme = keyof typeof THEME_COLORS;

const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

function getStoredTheme(): TTheme | null {
	try {
		const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

		return storedTheme === "light" || storedTheme === "dark"
			? storedTheme
			: null;
	} catch {
		return null;
	}
}

function getInitialTheme(): TTheme {
	return (
		getStoredTheme() ??
		(window.matchMedia(DARK_SCHEME_QUERY).matches ? "dark" : "light")
	);
}

export const useTheme = (): { theme: TTheme; toggleTheme: () => void } => {
	const [theme, setTheme] = useState<TTheme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		document
			.querySelector("meta[name=\"theme-color\"]")
			?.setAttribute("content", THEME_COLORS[theme]);
	}, [theme]);

	useEffect(() => {
		const media = window.matchMedia(DARK_SCHEME_QUERY);

		const listener = (event: MediaQueryListEvent): void => {
			if (!getStoredTheme()) {
				setTheme(event.matches ? "dark" : "light");
			}
		};

		media.addEventListener("change", listener);

		return () => media.removeEventListener("change", listener);
	}, []);

	function toggleTheme(): void {
		const nextTheme = theme === "dark" ? "light" : "dark";

		try {
			localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
		} catch {
			// Storage unavailable: the choice only lasts for this visit.
		}

		setTheme(nextTheme);
	}

	return { theme, toggleTheme };
};
