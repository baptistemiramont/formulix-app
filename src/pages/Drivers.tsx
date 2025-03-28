// Hooks
import { useData } from "@/hooks/useData";
// Types
import type { DriverType } from "@/types/driver";
// Components
import { DriverCard } from "@/components/cards/DriverCard";
import { Loader } from "@/components/Loader";
import { Select } from "@/components/form/Select";
import { Error } from "@/components/Error";
// Styling
import { css } from "@/../styled-system/css";
import { layoutGutters } from "@/styles/layout";
import { useEffect } from "react";

export const Drivers = () => {
	const {
		isDataLoading,
		error,
		filteredDrivers,
		resetFilteredDrivers,
		teams,
		filterByTeam,
	} = useData();

	const driversList = filteredDrivers.map((driver: DriverType) => (
		<DriverCard key={driver.id} driver={driver} />
	));

	const filteredTeams = [
		...(teams ?? []).map((team) => ({
			label: team.name,
			value: team.slug,
		})),
	];

	function handleTeamChange(event: React.ChangeEvent<HTMLSelectElement>): void {
		if (filteredDrivers) {
			filterByTeam(event.target.value);
		}
	}

	// Styles

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

	// Render

	useEffect(() => resetFilteredDrivers(), []);

	if (isDataLoading) return <Loader />;

	if (error) {
		return <Error message={`An error has occurred: ${error.message}`} />;
	}

	if (!filteredDrivers) {
		return <Error message="No driver found" />;
	}

	if (!filterByTeam) {
		return <Error message="No team found" />;
	}

	return (
		<section className={css(layoutGutters, driversPageStyle.container)}>
			<h1>Drivers</h1>
			<form>
				<div className={css(driversPageStyle.formFieldsContainer)}>
					<Select
						id="teams"
						label="Filter by team"
						defaultOptionLabel="All"
						options={filteredTeams}
						changeHandler={handleTeamChange}
					/>
				</div>
			</form>
			{driversList.length === 0 ? (
				<Error message="No driver found" />
			) : (
				<ul className={css(driversPageStyle.teamListStyle)}>{driversList}</ul>
			)}
		</section>
	);
};
