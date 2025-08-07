import { type FunctionComponent, useEffect } from "react";

import { useParams } from "@tanstack/react-router";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { StatCard } from "@/components/cards/StatCard";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";

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
		worldChampionships,
		yearOfStart,
		yearOfEnd,
		teamDetails,
		drivers,
	} = team;

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
						subtitle={subtitle}
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
				linkPath="/drivers/$driverSlug"
				linkParams={{ driverSlug: slug }}
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
				linkPath="/drivers/$driverSlug"
				linkParams={{ driverSlug: slug }}
			/>
		));

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
		teamContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gap: 8,
			},
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
					<div className={css(teamPageStyle.teamLogoContainer)}>
						<img
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
							label="World championships won"
							value={worldChampionships}
						/>
						<StatCard
							label="First team entry"
							value={yearOfStart}
						/>
						<StatCard
							label="Last team entry"
							value={
								yearOfEnd ? yearOfEnd : new Date().getFullYear()
							}
						/>
					</ul>
				</div>
			</div>
			{teamDetails.length > 1 && (
				<div className={css(teamPageStyle.teamContainer)}>
					<h2>Team's history</h2>
					<ul className={css(teamPageStyle.teamList)}>
						{formerTeamIdentities}
					</ul>
				</div>
			)}
			{activeDrivers.length > 0 && (
				<div className={css(teamPageStyle.teamContainer)}>
					<h2>Team's current drivers</h2>
					<ul className={css(teamPageStyle.teamList)}>
						{activeDrivers}
					</ul>
				</div>
			)}
			{formerDrivers.length > 0 && (
				<div className={css(teamPageStyle.teamContainer)}>
					<h2>Team's former driver(s)</h2>
					<ul className={css(teamPageStyle.teamList)}>
						{formerDrivers}
					</ul>
				</div>
			)}
		</section>
	);
};
