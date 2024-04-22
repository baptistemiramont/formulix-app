import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/team";
import { TeamCard } from "../components/cards/TeamCard";
import type { TeamType } from "../types/team";

export const Team = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["teams"],
		queryFn: getTeams,
	});

	if (isLoading) return "Loading...";

	if (error) return "An error has occurred: " + error.message;

	const { data: teamData } = data;

	const teams = teamData.map((team: TeamType) => (
		<TeamCard key={team.id} team={team} />
	));

	return (
		<div>
			<h1>Team</h1>
			<ul>{teams}</ul>
		</div>
	);
};
