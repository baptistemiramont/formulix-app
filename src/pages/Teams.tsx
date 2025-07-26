import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { TeamCard } from "@/components/cards/TeamCard";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";

export const Teams: FunctionComponent = () => {
	const { isTeamsLoading, teams, teamsError } = useData();

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

	if (isTeamsLoading) return <Loader />;

	if (teamsError) {
		return <Error message="An error has occurred" />;
	}

	const teamsList = (teams ?? []).map(({ id, name, slug, favicon }) => (
		<TeamCard key={id} name={name} slug={slug} favicon={favicon} />
	));

	return (
		<section className={css(layoutGutters, teamsPageStyle.container)}>
			<h1>Teams</h1>
			{teamsList.length === 0 ? (
				<p>No teams found.</p>
			) : (
				<ul className={css(teamsPageStyle.teamListStyle)}>
					{teamsList}
				</ul>
			)}
		</section>
	);
};
