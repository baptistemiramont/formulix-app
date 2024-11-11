// Router
import { useParams } from "@tanstack/react-router";
// Queries
import { useQuery } from "@tanstack/react-query";
import { getTeam } from "@/api/team";
// Components
import { Loader } from "@/components/Loader";
import { StatCard } from "@/components/cards/StatCard";
import { DriverCard } from "@/components/cards/DriverCard";
// Styling
import { css } from "@/../styled-system/css";
import { layoutGutters } from "@/styles/layout";

export const Team = () => {
	const { id } = useParams({ from: "/teams/$id" });

	const {
		data: team,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["team", id],
		queryFn: () => getTeam(id),
	});

	if (isLoading) return <Loader />;

	if (error) return "An error has occurred: " + error.message;

	if (!team) return "Team not found";

	const {
		name,
		fullName,
		favicon,
		worldChampionships,
		firstTeamEntry,
		drivers,
	} = team;

	const activeDrivers = drivers
		.filter((driver) => driver.isActive)
		.map((driver) => <DriverCard key={driver.id} driver={driver} />);
	const formerDrivers = drivers
		.filter((driver) => !driver.isActive)
		.map((driver) => <DriverCard key={driver.id} driver={driver} />);

	// Styles

	const teamPageStyle = {
		container: {
			paddingTop: 4,
			paddingBottom: 12,
			display: "grid",
			gap: 8,
			lg: {
				gap: 12,
			},
		},
		teamMainInfosContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gridTemplateColumns: "1fr 1fr",
				alignItems: "center",
			},
		},
		teamPortraitContainer: {
			display: "grid",
			justifyContent: "center",
			height: "auto",
		},
		teamLogoContainer: {
			display: "grid",
			justifyContent: "center",
		},
		teamName: {
			textAlign: "center",
		},
		teamStatListContainer: {
			height: "auto",
		},
		teamStatList: {
			height: "100%",
			display: "grid",
			gap: 6,
		},
		teamTeamsContainer: {
			display: "grid",
			gap: 8,
		},
		teamDriversContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gap: 8,
			},
		},
		teamDriversList: {
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
		<section className={css(layoutGutters, teamPageStyle.container)}>
			<div className={css(teamPageStyle.teamMainInfosContainer)}>
				<div className={css(teamPageStyle.teamPortraitContainer)}>
					<div className={css(teamPageStyle.teamLogoContainer)}>
						<img
							src={favicon}
							alt={`${name}'s logo`}
							width="250"
							loading="lazy"
						/>
					</div>
					<h1 className={css(teamPageStyle.teamName)}>{fullName}</h1>
				</div>
				<div className={css(teamPageStyle.teamStatListContainer)}>
					<ul className={css(teamPageStyle.teamStatList)}>
						<StatCard
							label="World championships won"
							value={worldChampionships}
						/>
						<StatCard label="First team entry" value={firstTeamEntry} />
					</ul>
				</div>
			</div>
			{activeDrivers.length > 0 && (
				<div className={css(teamPageStyle.teamDriversContainer)}>
					<h2>Team's current drivers</h2>
					<ul className={css(teamPageStyle.teamDriversList)}>
						{activeDrivers}
					</ul>
				</div>
			)}
			{formerDrivers.length > 0 && (
				<div className={css(teamPageStyle.teamDriversContainer)}>
					<h2>Team's former driver(s)</h2>
					<ul className={css(teamPageStyle.teamDriversList)}>
						{formerDrivers}
					</ul>
				</div>
			)}
		</section>
	);
};
