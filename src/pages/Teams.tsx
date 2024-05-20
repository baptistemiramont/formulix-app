import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/team";
import { TeamCard } from "../components/cards/TeamCard";
import type { TeamType } from "../types/team";
import { css } from "../../styled-system/css";
import { Loader } from "@/components/Loader";

export const Teams = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["teams"],
		queryFn: getTeams,
	});

	if (isLoading) return <Loader />;

	if (error) return "An error has occurred: " + error.message;

	const { data: teamData } = data;

	const teams = teamData.map((team: TeamType) => (
		<TeamCard key={team.id} team={team} />
	));

	const teamListStyle = css({
		display: "grid",
		gap: 6,
	});

	return (
		<div>
			<h1>Teams</h1>
			<ul className={teamListStyle}>{teams}</ul>
		</div>
	);
};
