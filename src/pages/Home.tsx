import { type FunctionComponent, type ReactNode, useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { css } from "@/../styled-system/css";
import { fromSettings } from "@/animations";
import { Button } from "@/components/Button";
import { GatewayCard } from "@/components/cards/GatewayCard";
import { RecordCard } from "@/components/cards/RecordCard";
import { Loader } from "@/components/Loader";
import { Logo } from "@/components/Logo";
import { NextGrandPrixCard } from "@/components/NextGrandPrixCard";
import { StandingsList } from "@/components/StandingsList";
import { useConstructorsChampionship } from "@/hooks/useConstructorsChampionship";
import { useDriversChampionship } from "@/hooks/useDriversChampionship";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNextGrandPrix } from "@/hooks/useNextGrandPrix";
import { useRecords } from "@/hooks/useRecords";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { ROUTES } from "@/utils/constants";
import { formatCount, listRecordCards } from "@/utils/record";
import { listConstructorRows, listDriverRows } from "@/utils/standings";

// The leaders the home page shows of each championship, the rest on the standings page
const DRIVERS_SHOWN = 5;
const CONSTRUCTORS_SHOWN = 3;

const appNameStyle = {
	color: "accentText",
};

const heroSectionStyle = {
	section: {
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		gap: 8,
		alignItems: "center",
		paddingTop: 8,
		paddingBottom: 12,
		lg: {
			gridTemplateColumns: "3fr 2fr",
			gap: 12,
			paddingY: 24,
		},
	},
	// Without the next Grand Prix, out of reach, the text takes the whole width
	sectionWithoutCard: {
		lg: {
			gridTemplateColumns: "minmax(0, 1fr)",
		},
	},
	textContainer: {
		display: "grid",
		gap: 6,
		lg: {
			gap: 8,
		},
	},
	title: {
		display: "grid",
		gap: 1,
		fontSize: "3xl",
		sm: {
			fontSize: "4xl",
		},
		lg: {
			fontSize: "5xl",
		},
		"& span:first-child": {
			fontSize: "4xl",
			fontWeight: 900,
			fontStyle: "oblique 8deg",
			textTransform: "uppercase",
			sm: {
				fontSize: "5xl",
			},
			lg: {
				fontSize: "7xl",
			},
		},
		"& span:last-child": {
			textTransform: "capitalize",
		},
	},
	subtitle: {
		color: "textMuted",
		fontSize: "lg",
		lg: {
			fontSize: "xl",
		},
	},
};

const homeSectionStyle = {
	section: {
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		gap: 6,
		paddingY: 12,
		lg: {
			gap: 8,
			paddingY: 16,
		},
	},
	header: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-between",
		alignItems: "end",
		gap: 4,
	},
	caption: {
		color: "textMuted",
		textStyle: "label",
	},
	championships: {
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		gap: 8,
		lg: {
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			alignItems: "start",
		},
	},
	championship: {
		display: "grid",
		gap: 3,
	},
	cards: {
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		gap: 4,
		md: {
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		},
		lg: {
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			gap: 6,
		},
	},
};

export const Home: FunctionComponent = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const nextGrandPrix = useNextGrandPrix();
	const records = useRecords();
	// The current season's, whichever season the standings page shows
	const driversChampionship = useDriversChampionship(null);
	const constructorsChampionship = useConstructorsChampionship(null);

	const refs = {
		heroAppName: useRef<HTMLSpanElement>(null),
		heroTitle: useRef<HTMLSpanElement>(null),
		heroSubtitle: useRef<HTMLParagraphElement>(null),
		heroCard: useRef<HTMLDivElement>(null),
	};

	useGSAP(() => {
		const animations = [
			gsap.from(refs.heroAppName.current, {
				...fromSettings.top,
			}),
			gsap.from(refs.heroTitle.current, {
				...fromSettings.left,
				delay: 0.25,
			}),
			gsap.from(refs.heroSubtitle.current, {
				...fromSettings.left,
				delay: 0.5,
			}),
			gsap.from(refs.heroCard.current, {
				...fromSettings.bottom,
				delay: 0.25,
			}),
		];

		return animations;
	}, []);

	let nextGrandPrixCard: ReactNode = null;

	if (nextGrandPrix.isLoading) {
		nextGrandPrixCard = <Loader />;
	} else if (nextGrandPrix.data !== undefined) {
		nextGrandPrixCard = <NextGrandPrixCard grandPrix={nextGrandPrix.data} />;
	}

	const hasCard = nextGrandPrixCard !== null;

	const totals = records.data?.totals ?? null;
	const gateways = [
		{
			title: "Drivers",
			icon: "mdi-racing-helmet",
			path: ROUTES.DRIVERS,
			total: totals?.drivers ?? null,
			totalLabel: "drivers since 1950",
			details: totals ? [`${totals.gridDrivers} on the grid`] : [],
		},
		{
			title: "Teams",
			icon: "mdi-flag-checkered",
			path: ROUTES.TEAMS,
			total: totals?.teams ?? null,
			totalLabel: "teams since 1950",
			details: totals ? [`${totals.activeTeams} on the grid`] : [],
		},
		{
			title: "Circuits",
			icon: "mdi-go-kart-track",
			path: ROUTES.CIRCUITS,
			total: totals?.circuits ?? null,
			totalLabel: "circuits since 1950",
			details: totals
				? [
						`${totals.activeCircuits} on the calendar`,
						`${formatCount(totals.grandsPrix)} Grands Prix over ${totals.seasons} seasons`,
					]
				: [],
		},
	];

	let championshipSection: ReactNode = null;

	if (driversChampionship.isLoading) {
		championshipSection = <Loader />;
	} else if (driversChampionship.data) {
		const { season, isFinal } = driversChampionship.data;

		championshipSection = (
			<section
				className={css(layoutGutters, homeSectionStyle.section)}
				aria-labelledby="championship-title"
			>
				<div className={css(homeSectionStyle.header)}>
					<div>
						<h2 id="championship-title" className={css(cornerTitle)}>
							{season} Championship
						</h2>
						<p className={css(homeSectionStyle.caption)}>
							{isFinal ? "Final standings" : "Provisional standings"}
						</p>
					</div>
					<Button
						label="Full standings"
						path={ROUTES.STANDINGS}
						variant="secondary"
					/>
				</div>
				<div className={css(homeSectionStyle.championships)}>
					<div className={css(homeSectionStyle.championship)}>
						<h3>Drivers</h3>
						<StandingsList
							rows={listDriverRows(driversChampionship.data).slice(
								0,
								DRIVERS_SHOWN
							)}
							titleLabel="World champion"
						/>
					</div>
					{constructorsChampionship.data?.season === season && (
						<div className={css(homeSectionStyle.championship)}>
							<h3>Constructors</h3>
							<StandingsList
								rows={listConstructorRows(
									constructorsChampionship.data
								).slice(0, CONSTRUCTORS_SHOWN)}
								titleLabel="Constructors' champion"
							/>
						</div>
					)}
				</div>
			</section>
		);
	}

	const recordCards = records.data
		? listRecordCards(records.data.records)
		: [];

	return (
		<>
			<section
				className={css(
					layoutGutters,
					heroSectionStyle.section,
					!hasCard && heroSectionStyle.sectionWithoutCard
				)}
			>
				<div className={css(heroSectionStyle.textContainer)}>
					{!isDesktop && <Logo />}
					<h1 className={css(heroSectionStyle.title)}>
						<span ref={refs.heroAppName} className={css(appNameStyle)}>
							Formulix
						</span>
						<span ref={refs.heroTitle}>Your ultimate F1 companion</span>
					</h1>
					<p
						ref={refs.heroSubtitle}
						className={css(heroSectionStyle.subtitle)}
					>
						Every driver, team and circuit of Formula 1 since 1950,
						with the standings of each season. Follow the current
						championship and count down to the next Grand Prix.
					</p>
				</div>
				<div ref={refs.heroCard}>{nextGrandPrixCard}</div>
			</section>
			{championshipSection}
			<section
				className={css(layoutGutters, homeSectionStyle.section)}
				aria-labelledby="explore-title"
			>
				<h2 id="explore-title" className={css(cornerTitle)}>
					Explore
				</h2>
				<ul className={css(homeSectionStyle.cards)}>
					{gateways.map((gateway) => (
						<GatewayCard key={gateway.path} {...gateway} />
					))}
				</ul>
			</section>
			{recordCards.length > 0 && (
				<section
					className={css(layoutGutters, homeSectionStyle.section)}
					aria-labelledby="records-title"
				>
					<h2 id="records-title" className={css(cornerTitle)}>
						All-time records
					</h2>
					<ul className={css(homeSectionStyle.cards)}>
						{recordCards.map(({ key, ...recordCard }) => (
							<RecordCard key={key} {...recordCard} />
						))}
					</ul>
				</section>
			)}
		</>
	);
};
