import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { TeamCard } from "@/components/cards/TeamCard";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";
import type { TTeam } from "@/types/team";

export const Teams: FunctionComponent = () => {
	const { isTeamsLoading, teams, teamsError } = useData();

	if (isTeamsLoading) return <Loader />;

	if (teamsError) {
		return <Error message="An error has occurred" />;
	}

	if (!teams) return "No teams found";

	const teamsList = teams.map((team: TTeam) => (
		<TeamCard key={team.id} team={team} />
	));

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
