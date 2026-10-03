import {
	type ChangeEvent,
	type FunctionComponent,
	type ReactNode,
	useEffect,
} from "react";

import { css } from "@/../styled-system/css";
import { Error } from "@/components/Error";
import { Select } from "@/components/form/Select";
import { HapticButton } from "@/components/HapticButton";
import { Loader } from "@/components/Loader";
import { StandingsList, type TStandingsRow } from "@/components/StandingsList";
import { useData } from "@/hooks/useData";
import { useFilter } from "@/hooks/useFilter";
import { fieldContainer } from "@/styles/form";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import type {
	TChampionship,
	TConstructorsChampionship,
	TDriversChampionship,
} from "@/types/standing";
import { FILTER_STORAGE_KEYS, ROUTES } from "@/utils/constants";
import {
	FIRST_CHAMPIONSHIP_SEASON,
	toChampionshipSeason,
} from "@/utils/standings";
import { toTeamColor } from "@/utils/team";

// The drivers' championship first: it opens the page, so only choosing the constructors' one needs keeping
const CHAMPIONSHIPS: { value: TChampionship; label: string }[] = [
	{ value: "drivers", label: "Drivers" },
	{ value: "constructors", label: "Constructors" },
];

function listDriverRows({ standings }: TDriversChampionship): TStandingsRow[] {
	return standings.map(({ driver, team, ...standing }) => ({
		...standing,
		key: driver.slug,
		name: `${driver.firstName} ${driver.lastName}`,
		teamName: team.name,
		image: driver.avatar,
		imageType: "avatar",
		imageAlt: `${driver.firstName} ${driver.lastName}'s avatar`,
		accentColor: team.color ? toTeamColor(team.color) : undefined,
		linkPath: ROUTES.DRIVER,
		linkParams: { driverSlug: driver.slug },
	}));
}

function listConstructorRows({
	standings,
}: TConstructorsChampionship): TStandingsRow[] {
	return standings.map(({ team, ...standing }) => ({
		...standing,
		key: team.slug,
		name: team.name,
		image: team.logo,
		imageType: "logo",
		imageAlt: `${team.name}'s logo`,
		accentColor: team.color ? toTeamColor(team.color) : undefined,
		linkPath: ROUTES.TEAM,
		linkParams: { teamSlug: team.slug },
	}));
}

export const Standings: FunctionComponent = () => {
	const {
		setChampionshipSeason,
		isDriversChampionshipLoading,
		driversChampionship,
		driversChampionshipError,
		isConstructorsChampionshipLoading,
		constructorsChampionship,
		constructorsChampionshipError,
	} = useData();
	const [storedChampionship, setChampionship] = useFilter(
		FILTER_STORAGE_KEYS.STANDINGS_CHAMPIONSHIP
	);
	const [storedSeason, setSeason] = useFilter(
		FILTER_STORAGE_KEYS.STANDINGS_SEASON
	);
	const championship: TChampionship =
		storedChampionship === "constructors" ? "constructors" : "drivers";
	const season = toChampionshipSeason(storedSeason);

	useEffect(() => {
		setChampionshipSeason(season);
	}, [season, setChampionshipSeason]);

	// The drivers' championship goes further back, to 1950: its seasons serve both
	const seasons = (driversChampionship ?? constructorsChampionship)?.seasons;

	if (!seasons) {
		return isDriversChampionshipLoading ||
			isConstructorsChampionshipLoading ? (
			<Loader />
		) : (
			<Error message="Failed to load the standings" />
		);
	}

	const [currentSeason] = seasons;
	const shownSeason = season ?? currentSeason;

	function handleSeasonChange(event: ChangeEvent<HTMLSelectElement>): void {
		setSeason(event.target.value);
	}

	const seasonOptions = seasons
		.filter((option) => option !== currentSeason)
		.map((option) => ({ label: String(option), value: String(option) }));

	const standingsPageStyle = {
		container: {
			paddingY: 12,
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			gap: 6,
		},
		formFieldsContainer: {
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			gap: 6,
			sm: {
				gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			},
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			},
		},
		championshipLabel: {
			color: "textMuted",
			textStyle: "label",
		},
		championshipGroup: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 1,
			padding: 1,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
		},
		championshipOption: {
			paddingX: 2,
			paddingY: 1.5,
			color: "textMuted",
			textStyle: "label",
			borderRadius: "sm",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
			// Still red under the finger: a phone keeps the hover on the option just tapped
			"&[aria-pressed=true], &[aria-pressed=true]:hover": {
				color: "accentText",
				backgroundColor: "surfaceMuted",
			},
		},
		standingsContainer: {
			display: "grid",
			gap: 4,
		},
		standingsCaption: {
			color: "textMuted",
			textStyle: "label",
		},
	};

	const isConstructors = championship === "constructors";
	const shownChampionship = isConstructors
		? constructorsChampionship && {
				season: constructorsChampionship.season,
				isFinal: constructorsChampionship.isFinal,
				rows: listConstructorRows(constructorsChampionship),
				titleLabel: "Constructors' champion",
			}
		: driversChampionship && {
				season: driversChampionship.season,
				isFinal: driversChampionship.isFinal,
				rows: listDriverRows(driversChampionship),
				titleLabel: "World champion",
			};
	const isLoading = isConstructors
		? isConstructorsChampionshipLoading
		: isDriversChampionshipLoading;
	const error = isConstructors
		? constructorsChampionshipError
		: driversChampionshipError;

	let standings: ReactNode;

	if (isConstructors && shownSeason < FIRST_CHAMPIONSHIP_SEASON) {
		standings = (
			<p>
				No constructors' championship in {shownSeason}: it started in{" "}
				{FIRST_CHAMPIONSHIP_SEASON}.
			</p>
		);
	} else if (error) {
		standings = <Error message="Failed to load the standings" />;
	} else if (
		isLoading ||
		!shownChampionship ||
		// Still the season shown before, until the one asked for arrives
		shownChampionship.season !== shownSeason
	) {
		standings = <Loader />;
	} else {
		standings = (
			<div className={css(standingsPageStyle.standingsContainer)}>
				<p className={css(standingsPageStyle.standingsCaption)}>
					{shownChampionship.isFinal
						? "Final standings"
						: "Provisional standings"}
				</p>
				<StandingsList
					rows={shownChampionship.rows}
					titleLabel={shownChampionship.titleLabel}
				/>
			</div>
		);
	}

	return (
		<section className={css(layoutGutters, standingsPageStyle.container)}>
			<h1 className={css(cornerTitle)}>Standings</h1>
			<form>
				<div className={css(standingsPageStyle.formFieldsContainer)}>
					<div className={css(fieldContainer)}>
						<p
							id="championship"
							className={css(
								standingsPageStyle.championshipLabel
							)}
						>
							Championship
						</p>
						<div
							role="group"
							aria-labelledby="championship"
							className={css(
								standingsPageStyle.championshipGroup
							)}
						>
							{CHAMPIONSHIPS.map(({ value, label }) => (
								<HapticButton
									key={value}
									type="button"
									onClick={() =>
										setChampionship(
											value === "constructors"
												? value
												: ""
										)
									}
									aria-pressed={championship === value}
									haptic={championship !== value}
									className={css(
										standingsPageStyle.championshipOption
									)}
								>
									{label}
								</HapticButton>
							))}
						</div>
					</div>
					<Select
						id="season"
						label="Season"
						defaultOptionLabel={String(currentSeason)}
						options={seasonOptions}
						value={season === null ? "" : String(season)}
						changeHandler={handleSeasonChange}
						onReset={() => setSeason("")}
					/>
				</div>
			</form>
			{standings}
		</section>
	);
};
