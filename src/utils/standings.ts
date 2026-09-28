import type { TStanding, TTeamIdentity } from "@/types/team";

// The constructors' championship started in 1958: earlier seasons have no standings
export const FIRST_CHAMPIONSHIP_SEASON = 1958;

// The steps between two labelled seasons, the smallest one leaving room for a label
const SEASON_STEPS = [1, 2, 5, 10, 20];

// Places labelled on the position axis besides the first one
const POSITION_STEP = 5;

export function findIdentity(
	identities: TTeamIdentity[],
	season: number
): TTeamIdentity | undefined {
	return identities.find(
		({ yearOfStart, yearOfEnd }) =>
			yearOfStart <= season && season <= (yearOfEnd ?? Infinity)
	);
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
