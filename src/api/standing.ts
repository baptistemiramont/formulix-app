import {
	constructorsChampionshipSchema,
	driversChampionshipSchema,
} from "@/types/schemas/standing";
import type {
	TConstructorsChampionship,
	TDriversChampionship,
} from "@/types/standing";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

// Without a season, the API answers with the current one
function toSeasonQuery(season: number | null): string {
	return season === null ? "" : `?season=${season}`;
}

export async function getDriversChampionship(
	season: number | null
): Promise<TDriversChampionship> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(
		`${API_URL}/standings/drivers${toSeasonQuery(season)}`,
		options
	);

	if (!response.ok) {
		throw new Error("Failed to fetch drivers' standings");
	}

	const { data } = await response.json();

	const { success, data: championship } =
		driversChampionshipSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return championship;
}

export async function getConstructorsChampionship(
	season: number | null
): Promise<TConstructorsChampionship> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(
		`${API_URL}/standings/teams${toSeasonQuery(season)}`,
		options
	);

	if (!response.ok) {
		throw new Error("Failed to fetch constructors' standings");
	}

	const { data } = await response.json();

	const { success, data: championship } =
		constructorsChampionshipSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return championship;
}
