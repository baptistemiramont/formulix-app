import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { getTeam } from "@/api/team";
import { Loader } from "@/components/Loader";
import { css } from "@/../styled-system/css";
import { StatCard } from "@/components/cards/StatCard";

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

	const { name, fullName, favicon, worldChampionships, firstTeamEntry } = team;

	// Style

	const pageStyle = {
		container: css({
			paddingY: 12,
			display: "grid",
			gap: 8,
		}),
		teamMainInfosContainer: css({
			display: "grid",
			gap: 4,
			lg: {
				gridTemplateColumns: "1fr 1fr",
				alignItems: "center",
			},
		}),
		teamPortraitContainer: css({
			display: "grid",
			justifyContent: "center",
			gap: 3,
		}),
		teamLogoContainer: css({
			display: "grid",
			justifyContent: "center",
		}),
		teamName: css({
			textAlign: "center",
		}),
		teamStatListContainer: css({
			height: "100%",
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
					<h1 className={pageStyle.teamName}>{name}</h1>
				</div>
				<div className={pageStyle.teamStatListContainer}>
					<ul className={pageStyle.teamStatList}>
						<StatCard label="Fullname" value={fullName} />
						<StatCard
							label="World championships won"
							value={worldChampionships}
						/>
						<StatCard label="First team entry" value={firstTeamEntry} />
					</ul>
				</div>
			</div>
			{/* <div className={pageStyle.driverTeamsContainer}>
				<h2>Driver's teams</h2>
				<ul className={pageStyle.driverTeamsList}>{teamsList}</ul>
			</div> */}
		</div>
	);
};
