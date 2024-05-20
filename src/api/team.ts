export const getTeams = async () => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/teams`);

		const data = await response.json();

		return data;
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
		return await fetch(`${import.meta.env.VITE_API_URL}/teams/${id}`);
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};
