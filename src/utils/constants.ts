export const API_URL: string = import.meta.env.VITE_API_URL;
export const API_KEY: string = import.meta.env.VITE_API_KEY;

export const QUERY_HEADERS = {
	APIKey: API_KEY,
};

export const ROUTES = {
	HOME: "/",
	DRIVERS: "/drivers",
	DRIVER: "/drivers/$driverSlug",
	TEAMS: "/teams",
	TEAM: "/teams/$teamSlug",
	CIRCUITS: "/circuits",
	CIRCUIT: "/circuits/$circuitSlug",
} as const;

export const THEME_STORAGE_KEY = "formulix-theme";

export const THEME_COLORS = {
	light: "#F2F2F4",
	dark: "#0D0D12",
} as const;
