import type { TDriverStanding } from "@/types/driver";
import type { TStanding, TStandingsBand } from "@/types/standing";

// The constructors' championship started in 1958: earlier seasons have no standings
export const FIRST_CHAMPIONSHIP_SEASON = 1958;

// The steps between two labelled seasons, the smallest one leaving room for a label
const SEASON_STEPS = [1, 2, 5, 10, 20];

// Places labelled on the position axis besides the first one
const POSITION_STEP = 5;

export function findBand(
	bands: TStandingsBand[],
	season: number
): TStandingsBand | undefined {
	return bands.find(
		({ yearOfStart, yearOfEnd }) =>
			yearOfStart <= season && season <= (yearOfEnd ?? Infinity)
	);
}

// The team a season goes with: the one the driver ended it with
function seasonTeamName({ teams }: TDriverStanding): string | undefined {
	return teams[teams.length - 1]?.name;
}

export function listDriverBands(
	standings: TDriverStanding[],
	currentTeamSlug?: string
): TStandingsBand[] {
	const bands: TStandingsBand[] = [];
	let lastSeason: number | undefined;

	for (const standing of standings) {
		const name = seasonTeamName(standing);
		const band = bands[bands.length - 1];

		if (name === undefined) continue;

		// A season away from the grid ends the band, even back with the same team
		if (band?.name === name && lastSeason === standing.season - 1) {
			band.yearOfEnd = standing.season;
		} else {
			bands.push({
				name,
				yearOfStart: standing.season,
				yearOfEnd: standing.season,
			});
		}

		lastSeason = standing.season;
	}

	// The team the driver races for today goes on: its band stays open, in the team colour
	const lastStanding = standings[standings.length - 1];
	const lastBand = bands[bands.length - 1];
	const lastTeam = lastStanding?.teams[lastStanding.teams.length - 1];

	if (lastBand && currentTeamSlug && lastTeam?.slug === currentTeamSlug) {
		lastBand.yearOfEnd = null;
	}

	return bands;
}

export function nameDriverSeason({ teams }: TDriverStanding): string {
	return teams.map(({ name }) => name).join(", then ");
}

export function listSeasonTicks(
	firstSeason: number,
	lastSeason: number,
	seasonWidth: number,
	minSpacing: number
): number[] {
	const step =
		SEASON_STEPS.find((seasons) => seasons * seasonWidth >= minSpacing) ??
		SEASON_STEPS[SEASON_STEPS.length - 1];
	const ticks: number[] = [];

	for (
		let season = Math.ceil(firstSeason / step) * step;
		season <= lastSeason;
		season += step
	) {
		ticks.push(season);
	}

	// A span shorter than the step still shows where it starts
	return ticks.length ? ticks : [firstSeason];
}

export function listPositionTicks(lowestPosition: number): number[] {
	const ticks = [1];

	for (
		let position = POSITION_STEP;
		position <= lowestPosition;
		position += POSITION_STEP
	) {
		ticks.push(position);
	}

	return ticks;
}

export function formatPosition({ position, isExcluded }: TStanding): string {
	if (isExcluded) return "Excluded";

	return position === null ? "Not classified" : `P${position}`;
}

export function formatPointsAndWins({ points, wins }: TStanding): string {
	return `${points} pts · ${wins} ${wins === 1 ? "win" : "wins"}`;
}
