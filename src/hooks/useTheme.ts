import { useEffect, useState } from "react";

import { THEME_COLORS, THEME_STORAGE_KEY } from "@/utils/constants";

export type TTheme = keyof typeof THEME_COLORS;

export type TThemePreference = TTheme | "system";

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

function getSystemTheme(): TTheme {
	return window.matchMedia(DARK_SCHEME_QUERY).matches ? "dark" : "light";
}

export const useTheme = (): {
	preference: TThemePreference;
	setPreference: (preference: TThemePreference) => void;
} => {
	const [preference, setPreferenceState] = useState<TThemePreference>(
		() => getStoredTheme() ?? "system"
	);
	const [systemTheme, setSystemTheme] = useState<TTheme>(getSystemTheme);

	const theme = preference === "system" ? systemTheme : preference;

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		document
			.querySelector("meta[name=\"theme-color\"]")
			?.setAttribute("content", THEME_COLORS[theme]);
	}, [theme]);

	useEffect(() => {
		const media = window.matchMedia(DARK_SCHEME_QUERY);

		const listener = (event: MediaQueryListEvent): void => {
			setSystemTheme(event.matches ? "dark" : "light");
		};

		media.addEventListener("change", listener);

		return () => media.removeEventListener("change", listener);
	}, []);

	function setPreference(nextPreference: TThemePreference): void {
		try {
			if (nextPreference === "system") {
				localStorage.removeItem(THEME_STORAGE_KEY);
			} else {
				localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
			}
		} catch {
			// Storage unavailable: the choice only lasts for this visit.
		}

		setPreferenceState(nextPreference);
	}

	return { preference, setPreference };
};
