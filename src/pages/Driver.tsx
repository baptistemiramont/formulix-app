import { type CSSProperties, type FunctionComponent, useEffect } from "react";

import { useParams } from "@tanstack/react-router";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { StatCard } from "@/components/cards/StatCard";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { StandingsChart } from "@/components/StandingsChart";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { ROUTES } from "@/utils/constants";
import { listDriverBands, nameDriverSeason } from "@/utils/standings";
import { getTeamColor } from "@/utils/team";

export const Driver: FunctionComponent = () => {
	const { driverSlug } = useParams({ from: ROUTES.DRIVER });
	const {
		setDriverSlug,
		isDriverLoading,
		driver,
		driverError,
		teams: allTeams,
	} = useData();

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
		standings,
	} = driver;

	const currentTeamSlug = teams.find(
		({ isCurrentTeam }) => isCurrentTeam
	)?.originalTeamSlug;
	const currentTeamColor = getTeamColor(allTeams, currentTeamSlug);

	const standingsBySeason = new Map(
		standings.map((standing) => [standing.season, standing])
	);
	const nameSeason = (season: number): string | undefined => {
		const standing = standingsBySeason.get(season);

		return standing && nameDriverSeason(standing);
	};

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
				imageType="logo"
				linkPath={`/teams/${originalTeamSlug}`}
				linkParams={{ teamSlug: originalTeamSlug }}
				subtitle={isCurrentTeam ? "Current" : undefined}
				accentColor={isCurrentTeam ? currentTeamColor : undefined}
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
			backgroundImage:
				"linear-gradient(to top, color-mix(in srgb, var(--driver-accent, token(colors.line)) 28%, transparent), transparent 75%)",
		},
		driverName: {
			textAlign: "center",
		},
		driverCareerContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gap: 8,
			},
		},
		driverCareerCaption: {
			color: "textMuted",
			textStyle: "label",
		},
		driverStatListContainer: {
			height: "100%",
		},
		driverStatList: {
			height: "100%",
			display: "grid",
			gap: 3,
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
					<div
						className={css(driverPageStyle.driverAvatarContainer)}
						style={
							{
								"--driver-accent": currentTeamColor,
							} as CSSProperties
						}
					>
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
						<StatCard
							label="Country"
							value={country}
							accentColor={currentTeamColor}
						/>
						<StatCard
							label="World championships won"
							value={worldChampionshipsTitle}
							accentColor={currentTeamColor}
						/>
						<StatCard
							label="Podiums"
							value={podiums}
							accentColor={currentTeamColor}
						/>
						<StatCard
							label="GP participations"
							value={grandPrixParticipation}
							accentColor={currentTeamColor}
						/>
					</ul>
				</div>
			</div>
			{standings.length > 0 && (
				<div className={css(driverPageStyle.driverCareerContainer)}>
					<h2 className={css(cornerTitle)}>
						{firstName} {lastName}'s career
					</h2>
					<p className={css(driverPageStyle.driverCareerCaption)}>
						Drivers' championship position by season
					</p>
					<StandingsChart
						championship="drivers"
						name={`${firstName} ${lastName}`}
						bands={listDriverBands(standings, currentTeamSlug)}
						standings={standings}
						firstSeason={standings[0].season}
						lastSeason={standings[standings.length - 1].season}
						teamColor={currentTeamColor}
						nameSeason={nameSeason}
					/>
				</div>
			)}
			<div className={css(driverPageStyle.driverTeamsContainer)}>
				<h2 className={css(cornerTitle)}>
					{firstName} {lastName}'s team(s)
				</h2>
				<ul className={css(driverPageStyle.driverTeamsList)}>
					{teamsList}
				</ul>
			</div>
		</section>
	);
};
