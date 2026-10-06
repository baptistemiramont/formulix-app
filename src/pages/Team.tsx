import {
	type CSSProperties,
	type FunctionComponent,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

import { useParams } from "@tanstack/react-router";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { StatCard } from "@/components/cards/StatCard";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { ShareButton } from "@/components/ShareButton";
import { StandingsChart } from "@/components/StandingsChart";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import type { TTeamDetailed } from "@/types/team";
import { TEAM_DRIVERS_PAGE_SIZE } from "@/utils/constants";
import { toPortraitType } from "@/utils/driver";
import { toTeamColor } from "@/utils/team";

type TTeamDriver = TTeamDetailed["drivers"][number];

const sectionStyle = {
	display: "grid",
	gap: 4,
	lg: {
		gap: 8,
	},
};

const cardListStyle = {
	display: "grid",
	gap: 6,
	gridTemplateColumns: "repeat(2, 1fr)",
	lg: {
		gridTemplateColumns: "repeat(3, 1fr)",
	},
	"2xl": {
		gridTemplateColumns: "repeat(4, 1fr)",
	},
};

// A long section comes a page at a time, and a new page shows from the section's title
const DriversSection: FunctionComponent<{
	title: string;
	cards: ReactNode[];
}> = ({ title, cards }) => {
	const [page, setPage] = useState(1);
	const sectionRef = useRef<HTMLDivElement>(null);

	if (!cards.length) return null;

	const pageCount = Math.ceil(cards.length / TEAM_DRIVERS_PAGE_SIZE);

	return (
		<div
			ref={sectionRef}
			className={css(sectionStyle, {
				scrollMarginTop: 4,
				// Clear of the header, which stays at the top of a desktop screen
				lg: { scrollMarginTop: 28 },
			})}
		>
			<h2 className={css(cornerTitle)}>{title}</h2>
			<ul className={css(cardListStyle)}>
				{cards.slice(
					(page - 1) * TEAM_DRIVERS_PAGE_SIZE,
					page * TEAM_DRIVERS_PAGE_SIZE
				)}
			</ul>
			<Pagination
				page={page}
				pageCount={pageCount}
				onPageChange={setPage}
				scrollTarget={sectionRef}
			/>
		</div>
	);
};

// Seasons with the team: one, or the first and the last
function formatTeamSeasons({
	firstSeason,
	lastSeason,
}: TTeamDriver): string | undefined {
	if (firstSeason === null || lastSeason === null) return undefined;

	return firstSeason === lastSeason
		? String(firstSeason)
		: `${firstSeason} - ${lastSeason}`;
}

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

	const toDriverCard = (
		driver: TTeamDriver,
		subtitle?: string,
		accentColor?: string
	): ReactNode => {
		const { id, firstName, lastName, slug, avatar, avatarCredit } = driver;

		return (
			<Card
				key={id}
				title={`${firstName} ${lastName}`}
				image={avatar}
				imageAlt={`${firstName} ${lastName}'s avatar`}
				imageType={toPortraitType(avatarCredit)}
				linkPath="/drivers/$driverSlug"
				linkParams={{ driverSlug: slug }}
				subtitle={subtitle}
				accentColor={accentColor}
			/>
		);
	};

	// Drivers come the latest to race for the team first, each section keeping that order
	const currentDrivers = drivers
		.filter(({ isCurrentDriver }) => isCurrentDriver)
		.map((driver) => toDriverCard(driver, undefined, teamColor));

	// A former driver with a Current team still races in Formula 1, shown in its colours
	const racingDrivers = drivers.flatMap((driver) => {
		const { isCurrentDriver, currentTeam } = driver;

		return !isCurrentDriver && currentTeam
			? [
					toDriverCard(
						driver,
						currentTeam.name,
						toTeamColor(currentTeam.color)
					),
				]
			: [];
	});

	const retiredDrivers = drivers
		.filter(
			({ isCurrentDriver, currentTeam }) =>
				!isCurrentDriver && !currentTeam
		)
		.map((driver) => toDriverCard(driver, formatTeamSeasons(driver)));

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
			gap: 3,
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
		teamContainer: sectionStyle,
		teamHistoryCaption: {
			color: "textMuted",
			textStyle: "label",
		},
		teamList: cardListStyle,
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
					<ShareButton title={fullName} />
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
			{/* Keyed by team: another team's page starts each section from its first page */}
			<DriversSection
				key={`${teamSlug}-current`}
				title="Team's current drivers"
				cards={currentDrivers}
			/>
			<DriversSection
				key={`${teamSlug}-racing`}
				title="Former drivers still racing"
				cards={racingDrivers}
			/>
			<DriversSection
				key={`${teamSlug}-retired`}
				title="Former drivers"
				cards={retiredDrivers}
			/>
		</section>
	);
};
