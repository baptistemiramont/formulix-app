import { z } from "zod";

import { teamDetailedSchema, teamSchema } from "@/types/schemas/team";
import type { TTeam, TTeamDetailed } from "@/types/team";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getTeams(): Promise<TTeam[]> {
	const options = {
		headers: QUERY_HEADERS,
	};

	const response = await fetch(`${API_URL}/teams`, options);

	if (!response.ok) {
		throw new Error(`HTTP error ! status: ${response.status}`);
	}

	const { data } = await response.json();

	const { success, data: teams } = z.array(teamSchema).safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	teams.forEach((team) => {
		team.favicon = `${API_URL.replace("/api/v1", "")}${team.favicon}`;
	});

	return teams;
}

export async function getTeam(teamSlug: string): Promise<TTeamDetailed> {
	const options = {
		headers: QUERY_HEADERS,
	};

	const response = await fetch(`${API_URL}/teams/${teamSlug}`, options);

	if (!response.ok) {
		throw new Error("Failed to fetch team data");
	}

	const { data } = await response.json();

	const { success, data: team } = teamDetailedSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	team.favicon = `${API_URL.replace("/api/v1", "")}${team.favicon}`;

	team.drivers.forEach((driver) => {
		driver.avatar = `${API_URL.replace("/api/v1", "")}${driver.avatar}`;
	});

	return team;
}
