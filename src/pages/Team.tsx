import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getTeam } from "@/api/team";
import { Loader } from "@/components/Loader";
import { css } from "@/../styled-system/css";
import { StatCard } from "@/components/cards/StatCard";
import { DriverCard } from "@/components/cards/DriverCard";

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

	const pageStyle = {
		container: css({
			paddingTop: 4,
			paddingBottom: 12,
			display: "grid",
			gap: 8,
			lg: {
				gap: 12,
			},
		}),
		teamMainInfosContainer: css({
			display: "grid",
			placeContent: "center",
			gap: 4,
			lg: {
				gridTemplateColumns: "1fr 1fr",
				alignItems: "center",
			},
		}),
		teamPortraitContainer: css({
			display: "grid",
			justifyContent: "center",
			height: "auto",
		}),
		teamLogoContainer: css({
			display: "grid",
			justifyContent: "center",
		}),
		teamName: css({
			textAlign: "center",
		}),
		teamStatListContainer: css({
			height: "auto",
		}),
		teamStatList: css({
			height: "100%",
			display: "grid",
			gap: 6,
		}),
		teamTeamsContainer: css({
			display: "grid",
			gap: 8,
		}),
		teamTeamsList: css({
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
		}),
		teamDriversContainer: css({
			display: "grid",
			gap: 4,
			lg: {
				gap: 8,
			},
		}),
		teamDriversList: css({
			display: "grid",
			gap: 6,
			gridTemplateColumns: "repeat(2, 1fr)",
			lg: {
				gridTemplateColumns: "repeat(3, 1fr)",
			},
		}),
	};

	return (
		<div className={pageStyle.container}>
			<div className={pageStyle.teamMainInfosContainer}>
				<div className={pageStyle.teamPortraitContainer}>
					<div className={pageStyle.teamLogoContainer}>
						<img
							src={favicon}
							alt={`${name}'s logo`}
							width="250"
							loading="lazy"
						/>
					</div>
					<h1 className={pageStyle.teamName}>{fullName}</h1>
				</div>
				<div className={pageStyle.teamStatListContainer}>
					<ul className={pageStyle.teamStatList}>
						<StatCard
							label="World championships won"
							value={worldChampionships}
						/>
						<StatCard label="First team entry" value={firstTeamEntry} />
					</ul>
				</div>
			</div>
			{activeDrivers.length > 0 && (
				<div className={pageStyle.teamDriversContainer}>
					<h2>Team's current drivers</h2>
					<ul className={pageStyle.teamDriversList}>{activeDrivers}</ul>
				</div>
			)}
			{formerDrivers.length > 0 && (
				<div className={pageStyle.teamDriversContainer}>
					<h2>Team's former driver(s)</h2>
					<ul className={pageStyle.teamDriversList}>{formerDrivers}</ul>
				</div>
			)}
		</div>
	);
};
