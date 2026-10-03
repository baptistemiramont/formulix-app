import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { useData } from "@/hooks/useData";
import { usePage } from "@/hooks/usePage";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { PAGE_STORAGE_KEYS } from "@/utils/constants";
import { paginate } from "@/utils/pagination";
import { toTeamColor } from "@/utils/team";

export const Teams: FunctionComponent = () => {
	const { isTeamsLoading, teams, teamsError } = useData();
	const [page, setPage] = usePage(PAGE_STORAGE_KEYS.TEAMS);

	if (isTeamsLoading) return <Loader />;

	if (teamsError) {
		return <Error message="An error has occurred" />;
	}

	const { pageItems, page: currentPage, pageCount } = paginate(teams, page);

	const teamsList = pageItems.map(
		({ id, isActive, name, slug, logo, color }) => (
			<Card
				key={id}
				title={name}
				image={logo}
				imageAlt={`${name}'s logo`}
				imageType="logo"
				linkPath={`/teams/${slug}`}
				linkParams={{ teamSlug: slug }}
				subtitle={isActive ? "Active" : "Inactive"}
				accentColor={toTeamColor(color)}
			/>
		)
	);

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
			<h1 className={css(cornerTitle)}>Teams</h1>
			{teamsList.length === 0 ? (
				<p>No teams found.</p>
			) : (
				<ul className={css(teamsPageStyle.teamListStyle)}>
					{teamsList}
				</ul>
			)}
			<Pagination
				page={currentPage}
				pageCount={pageCount}
				onPageChange={setPage}
			/>
		</section>
	);
};
