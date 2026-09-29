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
import { toTeamColor } from "@/utils/team";

export const Team: FunctionComponent = () => {
	const { teamSlug } = useParams({ from: "/teams/$teamSlug" });
	const { setTeamSlug, isTeamLoading, team, teamError } = useData();

	useEffect(() => {
		if (teamSlug) {
			setTeamSlug(teamSlug);
		}
	}, [teamSlug, setTeamSlug]);

	if (isTeamLoading) return <Loader />;

	if (teamError)
		return (
			<Error message="An error has occurred while fetching the team data" />
		);

	if (!team) return <Error message="No team data found" />;

	const {
		name,
		fullName,
		logo,
		color,
		worldChampionships,
		yearOfStart,
		yearOfEnd,
		teamDetails,
		drivers,
		standings,
	} = team;

	const teamColor = toTeamColor(color);

	// The last season raced, or the latest one ranked while the team races on
	const lastSeason =
		yearOfEnd ??
		standings[standings.length - 1]?.season ??
		new Date().getFullYear();
	const hasHistory = standings.length > 0 || teamDetails.length > 1;

	const formerTeamIdentities =
		teamDetails.length > 1 &&
		teamDetails
			.sort((a, b) => {
				if (a.yearOfStart > b.yearOfStart) return -1;
				if (a.yearOfStart < b.yearOfStart) return 1;
				return 0;
			})
			.map(({ id, name, logo, yearOfStart, yearOfEnd }) => {
				const subtitle = yearOfEnd
					? `${yearOfStart} - ${yearOfEnd}`
					: `${yearOfStart} - Present`;

				return (
					<Card
						key={id}
						title={name}
						image={logo}
						imageAlt={`${name}'s logo`}
						imageType="logo"
						subtitle={subtitle}
						accentColor={yearOfEnd ? undefined : teamColor}
					/>
				);
			});

	const activeDrivers = drivers
		.filter((driver) => driver.isCurrentDriver)
		.map(({ id, firstName, lastName, slug, avatar }) => (
			<Card
				key={id}
				title={`${firstName} ${lastName}`}
				image={avatar}
				imageAlt={`${firstName} ${lastName}'s avatar`}
				imageType="avatar"
				linkPath="/drivers/$driverSlug"
				linkParams={{ driverSlug: slug }}
				accentColor={teamColor}
			/>
		));

	const formerDrivers = drivers
		.filter((driver) => !driver.isCurrentDriver)
		.map(({ id, firstName, lastName, slug, avatar }) => (
			<Card
				key={id}
				title={`${firstName} ${lastName}`}
				image={avatar}
				imageAlt={`${firstName} ${lastName}'s avatar`}
				imageType="avatar"
				linkPath="/drivers/$driverSlug"
				linkParams={{ driverSlug: slug }}
			/>
		));

	const teamPageStyle = {
		container: {
			paddingTop: 4,
			paddingBottom: 12,
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			gap: 8,
			lg: {
				gap: 12,
			},
		},
		teamMainInfosContainer: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			gap: 4,
			lg: {
				gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
				alignItems: "center",
			},
		},
		teamPortraitContainer: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			justifyItems: "center",
			height: "auto",
		},
		teamLogoContainer: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			justifyItems: "center",
			maxWidth: "100%",
			padding: 6,
			backgroundColor: "plate",
			borderTopWidth: "2px",
			borderRightWidth: "2px",
			borderColor: "var(--team-accent)",
			borderTopRightRadius: "2xl",
		},
		teamLogo: {
			maxWidth: "100%",
			height: "auto",
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
			gap: 3,
		},
		teamTeamsContainer: {
			display: "grid",
			gap: 8,
		},
		teamContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gap: 8,
			},
		},
		teamHistoryCaption: {
			color: "textMuted",
			textStyle: "label",
		},
		teamList: {
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
					<div
						className={css(teamPageStyle.teamLogoContainer)}
						style={{ "--team-accent": teamColor } as CSSProperties}
					>
						<img
							className={css(teamPageStyle.teamLogo)}
							src={logo}
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
							label="Constructors' titles"
							value={worldChampionships}
							accentColor={teamColor}
						/>
						<StatCard
							label="First team entry"
							value={yearOfStart}
							accentColor={teamColor}
						/>
						<StatCard
							label="Last team entry"
							value={
								yearOfEnd ? yearOfEnd : new Date().getFullYear()
							}
							accentColor={teamColor}
						/>
					</ul>
				</div>
			</div>
			{hasHistory && (
				<div className={css(teamPageStyle.teamContainer)}>
					<h2 className={css(cornerTitle)}>Team's history</h2>
					{standings.length > 0 && (
						<>
							<p
								className={css(
									teamPageStyle.teamHistoryCaption
								)}
							>
								Constructors' championship position by season
							</p>
							<StandingsChart
								championship="constructors"
								name={name}
								bands={teamDetails}
								standings={standings}
								firstSeason={yearOfStart}
								lastSeason={lastSeason}
								teamColor={teamColor}
							/>
						</>
					)}
					{teamDetails.length > 1 && (
						<ul className={css(teamPageStyle.teamList)}>
							{formerTeamIdentities}
						</ul>
					)}
				</div>
			)}
			{activeDrivers.length > 0 && (
				<div className={css(teamPageStyle.teamContainer)}>
					<h2 className={css(cornerTitle)}>Team's current drivers</h2>
					<ul className={css(teamPageStyle.teamList)}>
						{activeDrivers}
					</ul>
				</div>
			)}
			{formerDrivers.length > 0 && (
				<div className={css(teamPageStyle.teamContainer)}>
					<h2 className={css(cornerTitle)}>Team's former driver(s)</h2>
					<ul className={css(teamPageStyle.teamList)}>
						{formerDrivers}
					</ul>
				</div>
			)}
		</section>
	);
};
