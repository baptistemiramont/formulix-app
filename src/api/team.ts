import { TeamType } from "@/types/team";

export const getTeams = async () => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/teams`);

		const { data } = await response.json();

		const teams = data.map((team: TeamType) => team);

		return teams;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};

export const getTeam = async (id: number) => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/teams/${id}`);

		const { data: team } = await response.json();

		return team;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};
