import { type FunctionComponent, useEffect } from "react";

import { useParams } from "@tanstack/react-router";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { StatCard } from "@/components/cards/StatCard";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";
import { ROUTES } from "@/utils/constants";

export const Driver: FunctionComponent = () => {
	const { driverSlug } = useParams({ from: ROUTES.DRIVER });
	const { setDriverSlug, isDriverLoading, driver, driverError } = useData();

	useEffect(() => {
		if (driverSlug) {
			setDriverSlug(driverSlug);
		}
	}, [driverSlug, setDriverSlug]);

	if (isDriverLoading) return <Loader />;

	if (driverError) return <Error message="Failed to load driver data" />;

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

	const teamsList = sortedTeams.map(
		({ id, name, originalTeamSlug, logo, isCurrentTeam }) => (
			<Card
				key={id}
				title={name}
				image={logo}
				imageAlt={`${name}'s logo`}
				linkPath={`/teams/${originalTeamSlug}`}
				linkParams={{ teamSlug: originalTeamSlug }}
				subtitle={isCurrentTeam ? "Current" : null}
			/>
		)
	);

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
