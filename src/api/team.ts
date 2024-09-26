import { teamSchema } from "@/types/schemas/team";
import type { TeamType } from "@/types/team";
import { z } from "zod";

export const getTeams = async (): Promise<TeamType[]> => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/teams`);

		const { data } = await response.json();

		const { success, data: teams } = z.array(teamSchema).safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		return teams;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};

export const getTeam = async (id: number): Promise<TeamType> => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/teams/${id}`);

		const { data } = await response.json();

		const { success, data: team } = teamSchema.safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		return team;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};
