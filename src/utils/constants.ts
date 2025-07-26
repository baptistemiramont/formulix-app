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
} as const;
