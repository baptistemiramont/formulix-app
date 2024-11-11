import type { TeamDetailedType, TeamType } from "@/types/team";
import { teamDetailedSchema, teamSchema } from "@/types/schemas/team";
import { z } from "zod";

const apiKey: string = import.meta.env.VITE_API_KEY;

export const getTeams = async (): Promise<TeamType[]> => {
	try {
		const options: RequestInit = {
			headers: {
				APIKey: apiKey,
			},
		};

		const response: Response = await fetch(
			`${import.meta.env.VITE_API_URL}/teams`,
			options
		);

		if (!response.ok) {
			throw new Error(`HTTP error ! status: ${response.status}`);
		}

		const { data } = await response.json();

		const { success, data: teams } = z.array(teamSchema).safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		return teams.map((team) => {
			return {
				...team,
				favicon: `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${team.favicon}`,
			};
		}) as TeamType[];
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};

export const getTeam = async (id: number): Promise<TeamDetailedType> => {
	try {
		const options: RequestInit = {
			headers: {
				APIKey: apiKey,
			},
		};

		const response: Response = await fetch(
			`${import.meta.env.VITE_API_URL}/teams/${id}`,
			options
		);

		if (!response.ok) {
			throw new Error(`HTTP error ! status: ${response.status}`);
		}

		const { data } = await response.json();

		const { success, data: team } = teamDetailedSchema.safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		team.favicon = `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${team.favicon}`;

		team.drivers = team.drivers.map((driver) => {
			return {
				...driver,
				avatar: `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${driver.avatar}`,
			};
		});

		return team as TeamDetailedType;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};
