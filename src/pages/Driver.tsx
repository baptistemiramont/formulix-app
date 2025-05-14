import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { getDriver } from "@/api/driver";
import { StatCard } from "@/components/cards/StatCard";
import { TeamCard } from "@/components/cards/TeamCard";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { layoutGutters } from "@/styles/layout";

export const Driver: FunctionComponent = () => {
	const { id } = useParams({ from: "/drivers/$id" });

	const {
		data: driver,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["driver", id],
		queryFn: () => getDriver(id),
	});

	if (isLoading) return <Loader />;

	if (error) return <Error message={error.message} />;

	if (!driver) return <Error message="Driver not found" />;

	const {
		firstName,
		lastName,
		avatar,
		country,
		worldChampionshipsTitle,
		podiums,
		grandPrixParticipation,
		teams,
	} = driver;

	const sortedTeams = teams.sort((a, b) => {
		if (a.isCurrentTeam && !b.isCurrentTeam) return -1;

		if (!a.isCurrentTeam && b.isCurrentTeam) return 1;

		return 0;
	});

	const teamsList = sortedTeams.map((team) => (
		<TeamCard key={team.id} team={team} />
	));

	// Styles

	const driverPageStyle = {
		container: {
			paddingTop: 4,
			paddingBottom: 12,
			display: "grid",
			gap: 8,
		},
		driverMainInfosContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gridTemplateColumns: "1fr 1fr",
				alignItems: "center",
			},
		},
		driverPortraitContainer: {
			display: "grid",
			justifyContent: "center",
			gap: 3,
		},
		driverAvatarContainer: {
			display: "grid",
			justifyContent: "center",
		},
		driverName: {
			textAlign: "center",
		},
		driverStatListContainer: {
			height: "100%",
		},
		driverStatList: {
			height: "100%",
			display: "grid",
			gap: 6,
		},
		driverTeamsContainer: {
			display: "grid",
			gap: 8,
		},
		driverTeamsList: {
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
		<section className={css(layoutGutters, driverPageStyle.container)}>
			<div className={css(driverPageStyle.driverMainInfosContainer)}>
				<div className={css(driverPageStyle.driverPortraitContainer)}>
					<div className={css(driverPageStyle.driverAvatarContainer)}>
						<img
							src={avatar}
							alt={`${firstName} ${lastName} avatar`}
							width="200"
							loading="lazy"
						/>
					</div>
					<h1 className={css(driverPageStyle.driverName)}>
						{firstName} {lastName}
					</h1>
				</div>
				<div className={css(driverPageStyle.driverStatListContainer)}>
					<ul className={css(driverPageStyle.driverStatList)}>
						<StatCard label="Country" value={country} />
						<StatCard
							label="World championships won"
							value={worldChampionshipsTitle}
						/>
						<StatCard label="Podiums" value={podiums} />
						<StatCard
							label="GP participations"
							value={grandPrixParticipation}
						/>
					</ul>
				</div>
			</div>
			<div className={css(driverPageStyle.driverTeamsContainer)}>
				<h2>
					{firstName} {lastName}'s team(s)
				</h2>
				<ul className={css(driverPageStyle.driverTeamsList)}>
					{teamsList}
				</ul>
			</div>
		</section>
	);
};
