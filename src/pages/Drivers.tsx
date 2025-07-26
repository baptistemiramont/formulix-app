import { type FunctionComponent, useEffect } from "react";

import { css } from "@/../styled-system/css";
import { DriverCard } from "@/components/cards/DriverCard";
import { Error } from "@/components/Error";
import { Select } from "@/components/form/Select";
import { Loader } from "@/components/Loader";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";

export const Drivers: FunctionComponent = () => {
	function handleTeamChange(
		event: React.ChangeEvent<HTMLSelectElement>
	): void {
		if (filteredDrivers) {
			filterByTeam(event.target.value);
		}
	}

	const {
		isTeamsLoading,
		isDriversLoading,
		filteredDrivers,
		driversError,
		resetFilteredDrivers,
		teams,
		filterByTeam,
	} = useData();

	useEffect(
		() => resetFilteredDrivers(),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	if (isTeamsLoading || isDriversLoading) return <Loader />;

	if (driversError) return <Error message="Failed to load drivers data" />;

	if (!filteredDrivers) return <Error message="No driver found" />;

	if (!filterByTeam) return <Error message="No team found" />;

	const driversList = filteredDrivers.map(
		({ id, firstName, lastName, slug, avatar, currentTeam }) => (
			<DriverCard
				key={id}
				firstName={firstName}
				lastName={lastName}
				slug={slug}
				avatar={avatar}
				currentTeamName={currentTeam.name}
			/>
		)
	);

	const filteredTeams = [
		...(teams ?? []).map((team) => ({
			label: team.name,
			value: team.slug,
		})),
	];

	const driversPageStyle = {
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
		formFieldsContainer: {
			display: "grid",
			gridTemplateColumns: "repeat(2, 1fr)",
			gap: 6,
			lg: {
				gridTemplateColumns: "repeat(3, 1fr)",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, 1fr)",
			},
		},
	};

	return (
		<section className={css(layoutGutters, driversPageStyle.container)}>
			<h1>Drivers</h1>
			<form>
				<div className={css(driversPageStyle.formFieldsContainer)}>
					<Select
						id="teams"
						label="Filter by active team"
						defaultOptionLabel="All"
						options={filteredTeams}
						changeHandler={handleTeamChange}
						onReset={resetFilteredDrivers}
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
		</section>
	);
};
