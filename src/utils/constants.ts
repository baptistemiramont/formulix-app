export const API_URL: string = import.meta.env.VITE_API_URL;
export const API_KEY: string = import.meta.env.VITE_API_KEY;

export const QUERY_HEADERS = {
	APIKey: API_KEY,
};

export const ROUTES = {
	HOME: "/",
	STANDINGS: "/standings",
	DRIVERS: "/drivers",
	DRIVER: "/drivers/$driverSlug",
	TEAMS: "/teams",
	TEAM: "/teams/$teamSlug",
	CIRCUITS: "/circuits",
	CIRCUIT: "/circuits/$circuitSlug",
} as const;

export const THEME_STORAGE_KEY = "formulix-theme";

export const FILTER_STORAGE_KEYS = {
	DRIVERS_SEARCH: "formulix-drivers-search",
	DRIVERS_TEAM: "formulix-drivers-team",
	DRIVERS_NATIONALITY: "formulix-drivers-nationality",
	DRIVERS_CHAMPION: "formulix-drivers-champion",
	TEAMS_SEARCH: "formulix-teams-search",
	TEAMS_STATUS: "formulix-teams-status",
	TEAMS_TITLED: "formulix-teams-titled",
	CIRCUITS_SEARCH: "formulix-circuits-search",
	CIRCUITS_STATUS: "formulix-circuits-status",
	CIRCUITS_COUNTRY: "formulix-circuits-country",
	STANDINGS_CHAMPIONSHIP: "formulix-standings-championship",
	STANDINGS_SEASON: "formulix-standings-season",
} as const;

// A team's drivers by section, whole rows on two, three and four columns alike
export const TEAM_DRIVERS_PAGE_SIZE = 12;

export const PAGE_STORAGE_KEYS = {
	DRIVERS: "formulix-drivers-page",
	TEAMS: "formulix-teams-page",
	CIRCUITS: "formulix-circuits-page",
} as const;

// A pause in typing long enough to mean the search is written
export const SEARCH_DEBOUNCE_MS = 300;

// A single letter would find most of a list
export const SEARCH_MIN_LENGTH = 2;

// The value of the team filter for the drivers without a current team
export const NO_CURRENT_TEAM = "none";

export const STATUS_OPTIONS = [
	{ label: "All", value: "" },
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
];

export const THEME_COLORS = {
	light: "#F2F2F4",
	dark: "#0D0D12",
} as const;

// The caches the service worker answers from without a connection, which the Offline copy fills
export const OFFLINE_CACHES = {
	API: "formulix-api",
	IMAGES: "formulix-images",
	FLAGS: "formulix-flags",
} as const;

// The API's images for a driver without a Portrait and a team without a logo: offline, they stand in for an image not kept
export const DEFAULT_IMAGE_PATHS = {
	DRIVERS: "/assets/images/drivers/default-driver-avatar.webp",
	TEAMS: "/assets/images/teams/default-team-logo.webp",
} as const;

export const OFFLINE_COPY_STORAGE_KEY = "formulix-offline-copy";

// The data changes with the API's weekly refresh: a day keeps the copy close to it, without downloading it at each opening
export const OFFLINE_COPY_MAX_AGE_MS = 24 * 60 * 60 * 1000;
