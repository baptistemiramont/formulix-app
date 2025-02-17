// Type
import type { TeamType } from "../types/team";
// Components
import { TeamCard } from "../components/cards/TeamCard";
import { Loader } from "@/components/Loader";
// Styling
import { css } from "../../styled-system/css";
import { layoutGutters } from "@/styles/layout";
import { useTeams } from "@/hooks/useTeams";

export const Teams = () => {
	const { data: teams, isLoading, error } = useTeams();

	if (isLoading) return <Loader />;

	if (error) return "An error has occurred: " + error.message;

	if (!teams) return "No teams found";

	const teamsList = teams.map((team: TeamType) => (
		<TeamCard key={team.id} team={team} />
	));

	// Styles

	const teamsPageStyle = {
		container: {
			paddingY: 12,
			display: "grid",
			gap: 6,
		},
		teamListStyle: {
			display: "grid",
			gap: 6,
			gridTemplateColumns: "repeat(2, 1fr)",
			lg: {
				gridTemplateColumns: "repeat(3, 1fr)",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, 1fr)",
			},
		},
	};

	return (
		<section className={css(layoutGutters, teamsPageStyle.container)}>
			<h1>Teams</h1>
			<ul className={css(teamsPageStyle.teamListStyle)}>{teamsList}</ul>
		</section>
	);
};
