import type {
	TAfterRound,
	TConstructorsChampionship,
	TDriversChampionship,
	TRound,
} from "@/types/standing";
import { toTeamColor } from "@/utils/team";

// A driver's or a team's points through a season, as the chart draws them
export type TRoundsLine = {
	// The driver's or team's slug
	key: string;
	name: string;
	// What the key and the end of the line show: a driver's last name, a team's name
	label: string;
	// Null under a team's former name, whose colour Formulix does not know
	color: string | null;
	// Lines of one colour told apart: a team's drivers, or teams sharing a colour (the grey of the teams of the past, the text's without one)
	dash: TRoundsDash;
	// The team the line goes with: teammates share one
	team: string;
	afterRounds: (TAfterRound | null)[];
};

// The leaders lit up at first on the standings page, the others dimmed as context
export const ROUNDS_FOCUS_SIZE = 5;

export type TRoundsDash = "solid" | "dashed" | "dotted";

const DASHES: TRoundsDash[] = ["solid", "dashed", "dotted"];

// Gives each line of a colour the next dash: a team's first driver is solid, its second dashed
function dashLines<T extends { color: string | null }>(
	lines: T[]
): (T & { dash: TRoundsDash })[] {
	const counts = new Map<string | null, number>();

	return lines.map((line) => {
		const count = counts.get(line.color) ?? 0;

		counts.set(line.color, count + 1);

		return { ...line, dash: DASHES[count % DASHES.length] };
	});
}

// The steps between two labelled rounds, the smallest one leaving room for a label
const ROUND_STEPS = [1, 2, 3, 4, 5, 6, 8, 10];

// The steps between two labelled points, before their power of ten
const POINT_STEPS = [1, 2, 2.5, 5, 10];

// The surfaces the chart lies on, as panda.config.ts sets them
export const CHART_SURFACES = {
	light: "#FFFFFF",
	dark: "#191921",
} as const;

// WCAG's floor for a graphical object against its background
const MIN_LINE_CONTRAST = 3;

export function listDriverLines({
	standings,
}: TDriversChampionship): TRoundsLine[] {
	return dashLines(
		standings.map(({ driver, team, afterRounds }) => ({
			key: driver.slug,
			name: `${driver.firstName} ${driver.lastName}`,
			label: driver.lastName,
			color: team.color && toTeamColor(team.color),
			// A team Formulix does not follow goes by its name
			team: team.slug ?? team.name,
			afterRounds,
		}))
	);
}

export function listConstructorLines({
	standings,
}: TConstructorsChampionship): TRoundsLine[] {
	return dashLines(
		standings.map(({ team, afterRounds }) => ({
			key: team.slug,
			name: team.name,
			label: team.name,
			color: team.color && toTeamColor(team.color),
			team: team.slug,
			afterRounds,
		}))
	);
}

// The index of the last round a line reaches, -1 when it reaches none
export function findLastRaced(afterRounds: (TAfterRound | null)[]): number {
	for (let index = afterRounds.length - 1; index >= 0; index--) {
		if (afterRounds[index]) return index;
	}

	return -1;
}

export function formatRound({ round, name }: TRound): string {
	return name ? `Round ${round} · ${name}` : `Round ${round}`;
}

// Shared fastest laps and shared cars left fractions of a point in the 1950s
export function formatPoints(points: number): string {
	return `${Number(points.toFixed(2))} pts`;
}

// How far behind the leader of the round
export function formatGap(points: number, leaderPoints: number): string {
	return points >= leaderPoints
		? "Leader"
		: `−${Number((leaderPoints - points).toFixed(2))}`;
}

export function listRoundTicks(
	roundsCount: number,
	roundWidth: number,
	minSpacing: number
): number[] {
	const step =
		ROUND_STEPS.find((rounds) => rounds * roundWidth >= minSpacing) ??
		ROUND_STEPS[ROUND_STEPS.length - 1];

	// By index: the first round, then every step
	return Array.from(
		{ length: Math.ceil(roundsCount / step) },
		(_, index) => index * step
	);
}

// A round ceiling for the points axis, and the labelled points up to it
export function listPointTicks(
	maxPoints: number,
	maxTicks: number
): number[] {
	const rawStep = Math.max(maxPoints, 1) / maxTicks;
	const power = 10 ** Math.floor(Math.log10(rawStep));
	const step =
		(POINT_STEPS.find((candidate) => candidate * power >= rawStep) ?? 10) *
		power;
	const ticks = [0];

	while (ticks[ticks.length - 1] < maxPoints) {
		ticks.push(Number((ticks[ticks.length - 1] + step).toFixed(2)));
	}

	return ticks;
}

// Pushes apart the labels at the end of the lines, kept between top and bottom, in their order
export function spreadLabels(
	positions: number[],
	minGap: number,
	top: number,
	bottom: number
): number[] {
	const order = positions
		.map((position, index) => ({ position, index }))
		.sort((a, b) => a.position - b.position);
	const spread = order.map(({ position }) => position);

	for (let index = 0; index < spread.length; index++) {
		spread[index] = Math.max(
			spread[index],
			index ? spread[index - 1] + minGap : top
		);
	}

	// Labels pushed past the bottom come back up together
	for (let index = spread.length - 1; index >= 0; index--) {
		spread[index] = Math.min(
			spread[index],
			index < spread.length - 1 ? spread[index + 1] - minGap : bottom
		);
	}

	const result = new Array<number>(positions.length);

	order.forEach(({ index }, rank) => {
		result[index] = spread[rank];
	});

	return result;
}

function toRgb(color: string): [number, number, number] {
	const hex = color.replace("#", "");

	return [0, 2, 4].map((start) =>
		parseInt(hex.slice(start, start + 2), 16)
	) as [number, number, number];
}

function toHex(rgb: number[]): string {
	return `#${rgb
		.map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
		.join("")}`;
}

function toLuminance(rgb: number[]): number {
	const [red, green, blue] = rgb.map((channel) => {
		const value = channel / 255;

		return value <= 0.03928
			? value / 12.92
			: ((value + 0.055) / 1.055) ** 2.4;
	});

	return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function toContrast(rgb: number[], other: number[]): number {
	const [lighter, darker] = [toLuminance(rgb), toLuminance(other)].sort(
		(a, b) => b - a
	);

	return (lighter + 0.05) / (darker + 0.05);
}

// A team colour as a line can show it on a surface: darkened on a light one, lightened on a dark one, until it stands out
export function toReadableColor(color: string, surface: string): string {
	const rgb = toRgb(color);
	const surfaceRgb = toRgb(surface);
	const target = toLuminance(surfaceRgb) > 0.5 ? 0 : 255;

	for (let mix = 0; mix < 1; mix += 0.05) {
		const mixed = rgb.map((channel) => channel + (target - channel) * mix);

		if (toContrast(mixed, surfaceRgb) >= MIN_LINE_CONTRAST) {
			return toHex(mixed);
		}
	}

	return toHex([target, target, target]);
}
