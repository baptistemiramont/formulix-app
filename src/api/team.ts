export const getTeams = async () => {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/teams`);

	const data = await response.json();

	return data;
};
