import { type ChangeEvent, type FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { Error } from "@/components/Error";
import { Select } from "@/components/form/Select";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { useData } from "@/hooks/useData";
import { useFilter } from "@/hooks/useFilter";
import { usePage } from "@/hooks/usePage";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { FILTER_STORAGE_KEYS, PAGE_STORAGE_KEYS } from "@/utils/constants";
import { paginate } from "@/utils/pagination";
import { getTeamColor } from "@/utils/team";

export const Drivers: FunctionComponent = () => {
	const { drivers, teams, isDriversLoading, driversError } = useData();
	const [team, setTeam] = useFilter(FILTER_STORAGE_KEYS.DRIVERS_TEAM);
	const [page, setPage] = usePage(PAGE_STORAGE_KEYS.DRIVERS);

	// Another filter makes another list: it starts from its first page
	function filterByTeam(nextTeam: string): void {
		setTeam(nextTeam);
		setPage(1);
	}

	function handleTeamChange(event: ChangeEvent<HTMLSelectElement>): void {
		filterByTeam(event.target.value);
	}

	if (isDriversLoading) return <Loader />;

	if (driversError) return <Error message="Failed to load drivers data" />;

	const mappedTeams = new Map<string, string>();

	drivers.forEach((driver) => {
		if (driver.currentTeam) {
			mappedTeams.set(driver.currentTeam.name, driver.currentTeam.slug);
		}
	});

	mappedTeams.set("No team/Inactive", "off");

	const teamOptions = Array.from(mappedTeams, ([label, value]) => ({
		label,
		value,
	}));

	const filteredDrivers = drivers.filter(({ currentTeam }) =>
		team === "off" ? !currentTeam : !team || currentTeam?.slug === team
	);
	const {
		pageItems,
		page: currentPage,
		pageCount,
	} = paginate(filteredDrivers, page);

	const driversList = pageItems.map(
		({ id, firstName, lastName, slug, avatar, currentTeam }) => (
			<Card
				key={id}
				title={`${firstName} ${lastName}`}
				image={avatar}
				imageAlt={`${firstName} ${lastName}'s avatar`}
				imageType="avatar"
				linkPath="/drivers/$driverSlug"
				linkParams={{ driverSlug: slug }}
				subtitle={currentTeam ? currentTeam.name : "No team/Inactive"}
				accentColor={getTeamColor(teams, currentTeam?.slug)}
			/>
		)
	);

	const driversPageStyle = {
		container: {
			paddingY: 12,
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			gap: 6,
		},
		teamListStyle: {
			display: "grid",
			gap: 6,
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			},
		},
		formFieldsContainer: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 6,
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			},
		},
	};

	return (
		<section className={css(layoutGutters, driversPageStyle.container)}>
			<h1 className={css(cornerTitle)}>Drivers</h1>
			<form>
				<div className={css(driversPageStyle.formFieldsContainer)}>
					<Select
						id="teams"
						label="Filter by team"
						defaultOptionLabel="All"
						options={teamOptions}
						value={team}
						changeHandler={handleTeamChange}
						onReset={() => filterByTeam("")}
					/>
				</div>
			</form>
			{driversList.length === 0 ? (
				<p>No drivers match the selected team.</p>
			) : (
				<ul className={css(driversPageStyle.teamListStyle)}>
					{driversList}
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
