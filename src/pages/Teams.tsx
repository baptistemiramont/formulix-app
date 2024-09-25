import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/team";
import { TeamCard } from "../components/cards/TeamCard";
import type { TeamType } from "../types/team";
import { css } from "../../styled-system/css";
import { Loader } from "@/components/Loader";

export const Teams = () => {
	const {
		data: teams,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["teams"],
		queryFn: getTeams,
	});

	if (isLoading) return <Loader />;

	if (error) return "An error has occurred: " + error.message;

	if (!teams) return "No teams found";

	const teamsList = teams.map((team: TeamType) => (
		<TeamCard key={team.id} team={team} />
	));

	const pageStyle = {
		container: css({
			paddingY: 12,
			display: "grid",
			gap: 6,
		}),
	};

	const teamListStyle = css({
		display: "grid",
		gap: 6,
		md: {
			gridTemplateColumns: "repeat(2, 1fr)",
		},
		lg: {
			gridTemplateColumns: "repeat(3, 1fr)",
		},
		xl: {
			gridTemplateColumns: "repeat(4, 1fr)",
		},
	});

	return (
		<div className={pageStyle.container}>
			<h1>Teams</h1>
			<ul className={teamListStyle}>{teamsList}</ul>
		</div>
	);
};
