import {
	type CSSProperties,
	type FunctionComponent,
	type KeyboardEvent,
	type PointerEvent,
	useEffect,
	useRef,
	useState,
} from "react";

import { css, cx } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import { useElementWidth } from "@/hooks/useElementWidth";
import type { TAfterRound, TChampionship, TRound } from "@/types/standing";
import {
	CHART_SURFACES,
	findLastRaced,
	formatGap,
	formatPoints,
	formatRound,
	listPointTicks,
	listRoundTicks,
	spreadLabels,
	toReadableColor,
	type TRoundsDash,
	type TRoundsLine,
} from "@/utils/rounds";
import { formatShortPosition } from "@/utils/standings";

type TRoundsChartProps = {
	championship: TChampionship;
	season: number;
	rounds: TRound[];
	// In the order of the standings
	lines: TRoundsLine[];
	// The lines in colour at first, by key: the key lights up or dims any other
	initialFocus: string[];
};

const WORDING: Record<
	TChampionship,
	{ championship: string; name: string; names: string }
> = {
	constructors: {
		championship: "constructors' championship",
		name: "Team",
		names: "teams",
	},
	drivers: {
		championship: "drivers' championship",
		name: "Driver",
		names: "drivers",
	},
};

const MARGIN = { top: 12, right: 12, bottom: 28, left: 40 };
const MIN_ROUND_TICK_SPACING = 36;
// The names at the end of the lines and a tooltip over them need a wide chart: on a phone, the key names the lines and the round reads below the chart
const MIN_WIDE_WIDTH = 520;
const LABEL_GAP = 8;
// Label text at 12px: an estimate, a longer name is cut by the chart's edge
const LABEL_CHAR_WIDTH = 7;
const MAX_LABELS_WIDTH = 112;
const MIN_LABEL_SPACING = 14;
const MARKER_RADIUS = 4;
// A grid fits in the key: past it, as with the Indianapolis 500 drivers of the 1950s, the key starts from the top of the standings
const KEY_SIZE = 24;
// Round caps make dots of the dotted line's dashes
const DASH_ARRAYS: Record<TRoundsDash, string | undefined> = {
	solid: undefined,
	dashed: "6 4",
	dotted: "0.5 5",
};

// A line's colour on each theme, which the stylesheet picks from: a team colour too light or too dark for a surface is made readable on it
function toLineColors(color: string | null): CSSProperties {
	return {
		"--line-light": color
			? toReadableColor(color, CHART_SURFACES.light)
			: "var(--colors-text)",
		"--line-dark": color
			? toReadableColor(color, CHART_SURFACES.dark)
			: "var(--colors-text)",
	} as CSSProperties;
}

const lineColor = {
	stroke: "var(--line-light)",
	_dark: {
		stroke: "var(--line-dark)",
	},
};

const chartStyle = {
	container: css({
		display: "grid",
		gap: 3,
		padding: 3,
		backgroundColor: "surface",
		lg: {
			padding: 4,
		},
	}),
	chartArea: css({
		position: "relative",
		outline: "none",
		// A finger resting on a round reads it: iOS must not select the labels nor open its Copy menu
		userSelect: "none",
		WebkitUserSelect: "none",
		WebkitTouchCallout: "none",
		_focusVisible: {
			boxShadow: "0 0 0 2px token(colors.accent)",
		},
	}),
	svg: css({
		display: "block",
		overflow: "visible",
		touchAction: "pan-y",
	}),
	grid: css({
		stroke: "line",
		strokeWidth: 1,
	}),
	axisLabel: css({
		fill: "textMuted",
		fontSize: "12px",
		fontVariantNumeric: "tabular-nums",
	}),
	crosshair: css({
		stroke: "textMuted",
		strokeWidth: 1,
	}),
	// Every line as context, behind the ones in colour
	line: css({
		fill: "none",
		stroke: "textMuted",
		strokeOpacity: 0.3,
		strokeWidth: 1,
		strokeLinejoin: "round",
		strokeLinecap: "round",
	}),
	focusedLine: css(lineColor, {
		fill: "none",
		strokeWidth: 2.5,
		strokeLinejoin: "round",
		strokeLinecap: "round",
	}),
	marker: css({
		fill: "var(--line-light)",
		stroke: "surface",
		strokeWidth: 2,
		_dark: {
			fill: "var(--line-dark)",
		},
	}),
	endLabel: css({
		fill: "text",
		fontSize: "12px",
		fontWeight: 600,
	}),
	readout: css({
		display: "grid",
		gap: 1.5,
	}),
	tooltip: css({
		position: "absolute",
		zIndex: 1,
		minWidth: "220px",
		maxWidth: "320px",
		paddingX: 3,
		paddingY: 2,
		backgroundColor: "surface",
		borderWidth: "1px",
		borderColor: "line",
		boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
		pointerEvents: "none",
	}),
	// Below the chart on a phone, telling the latest round until a finger picks another
	staticReadout: css({
		marginTop: 3,
	}),
	tooltipLabel: css({
		color: "textMuted",
		textStyle: "label",
		lg: {
			fontSize: "xs",
		},
	}),
	tooltipRow: css({
		display: "contents",
	}),
	tooltipRows: css({
		display: "grid",
		gridTemplateColumns: "auto auto minmax(0, 1fr) auto auto",
		alignItems: "center",
		columnGap: 2,
		rowGap: 1,
		fontSize: "sm",
		lg: {
			fontSize: "sm",
		},
	}),
	tooltipPosition: css({
		textStyle: "figure",
		fontSize: "sm",
	}),
	tooltipName: css({
		fontWeight: 600,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
	}),
	tooltipPoints: css({
		textAlign: "right",
		fontVariantNumeric: "tabular-nums",
	}),
	tooltipGap: css({
		color: "textMuted",
		textAlign: "right",
		fontVariantNumeric: "tabular-nums",
	}),
	key: css({
		display: "flex",
		flexWrap: "wrap",
		gap: 1.5,
	}),
	keyButton: css({
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		paddingX: 2,
		paddingY: 1,
		color: "textMuted",
		textStyle: "label",
		borderWidth: "1px",
		borderColor: "line",
		borderRadius: "sm",
		cursor: "pointer",
		transition: "var(--default-animation)",
		_hover: {
			color: "text",
		},
		"&[aria-pressed=true]": {
			color: "text",
			backgroundColor: "surfaceMuted",
		},
		lg: {
			fontSize: "xs",
		},
	}),
	swatch: css({
		flexShrink: 0,
		width: 5,
		borderTopWidth: "3px",
		borderTopColor: "var(--line-light)",
		_dark: {
			borderTopColor: "var(--line-dark)",
		},
	}),
	// A dimmed line keeps its place in the key, without its colour
	dimSwatch: css({
		flexShrink: 0,
		width: 5,
		borderTopWidth: "3px",
		borderTopColor: "line",
	}),
	solidSwatch: css({
		borderTopStyle: "solid",
	}),
	dashedSwatch: css({
		borderTopStyle: "dashed",
	}),
	dottedSwatch: css({
		borderTopStyle: "dotted",
	}),
	// A table keeps its content width despite srOnly: a hidden block clips it, so it doesn't widen the page
	tableContainer: css({
		srOnly: true,
	}),
};

const SWATCH_STYLES: Record<TRoundsDash, string> = {
	solid: chartStyle.solidSwatch,
	dashed: chartStyle.dashedSwatch,
	dotted: chartStyle.dottedSwatch,
};

export const RoundsChart: FunctionComponent<TRoundsChartProps> = ({
	championship,
	season,
	rounds,
	lines,
	initialFocus,
}: TRoundsChartProps) => {
	const wording = WORDING[championship];
	const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>();
	const [focus, setFocus] = useState(() => new Set(initialFocus));
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const [isKeyOpen, setIsKeyOpen] = useState(false);
	const chartRef = useRef<HTMLDivElement>(null);

	// A round read by touch stays once the finger lifts, until a tap elsewhere on the page
	useEffect(() => {
		if (activeIndex === null) return;

		const closeOnTapElsewhere = (event: Event): void => {
			if (!chartRef.current?.contains(event.target as Node)) {
				setActiveIndex(null);
			}
		};

		document.addEventListener("pointerdown", closeOnTapElsewhere);

		return () =>
			document.removeEventListener("pointerdown", closeOnTapElsewhere);
	}, [activeIndex]);

	const roundsCount = rounds.length;
	const lastIndex = roundsCount - 1;
	const focusedLines = lines.filter(({ key }) => focus.has(key));
	// The lines lit up at first stay in a shortened key, wherever they rank
	const keyLines =
		isKeyOpen || lines.length <= KEY_SIZE
			? lines
			: lines.filter(
					({ key }, index) =>
						index < KEY_SIZE || initialFocus.includes(key)
				);
	const hiddenCount = lines.length - keyLines.length;

	const width = containerWidth;
	const height = Math.round(Math.min(380, Math.max(260, width * 0.5)));
	const isWide = width >= MIN_WIDE_WIDTH;
	const isLabelled = isWide && focusedLines.length > 0;
	const labelsWidth = isLabelled
		? Math.min(
				MAX_LABELS_WIDTH,
				Math.max(...focusedLines.map(({ label }) => label.length)) *
					LABEL_CHAR_WIDTH +
					LABEL_GAP
			)
		: 0;
	const right = MARGIN.right + labelsWidth;
	const plotWidth = Math.max(0, width - MARGIN.left - right);
	const plotHeight = height - MARGIN.top - MARGIN.bottom;
	const plotBottom = MARGIN.top + plotHeight;

	const roundWidth = plotWidth / Math.max(1, lastIndex);
	const roundX = (index: number): number => MARGIN.left + index * roundWidth;

	// The scale holds every line, so lighting one up never moves the others
	const maxPoints = Math.max(
		1,
		...lines.flatMap(({ afterRounds }) =>
			afterRounds.map((standing) => standing?.points ?? 0)
		)
	);
	const pointTicks = listPointTicks(maxPoints, plotHeight >= 240 ? 5 : 4);
	const topPoints = pointTicks[pointTicks.length - 1];
	const pointsY = (points: number): number =>
		MARGIN.top + plotHeight * (1 - points / topPoints);

	const linePath = ({ afterRounds }: TRoundsLine): string =>
		afterRounds
			.map((standing, index) => {
				if (!standing) return "";

				const isFollowing = index > 0 && afterRounds[index - 1] !== null;

				return `${isFollowing ? "L" : "M"}${roundX(index)},${pointsY(standing.points)}`;
			})
			.join("");

	const roundTicks = listRoundTicks(
		roundsCount,
		roundWidth,
		MIN_ROUND_TICK_SPACING
	);

	// Each name beside the last round its line reaches
	const endIndexes = focusedLines.map(({ afterRounds }) =>
		findLastRaced(afterRounds)
	);
	const labelYs = spreadLabels(
		focusedLines.map(({ afterRounds }, index) =>
			endIndexes[index] < 0
				? plotBottom
				: pointsY(afterRounds[endIndexes[index]]?.points ?? 0)
		),
		MIN_LABEL_SPACING,
		MARGIN.top,
		plotBottom
	);

	const clampIndex = (index: number): number =>
		Math.min(lastIndex, Math.max(0, index));

	const handlePointerMove = (event: PointerEvent<SVGSVGElement>): void => {
		const { left } = event.currentTarget.getBoundingClientRect();
		const offset = event.clientX - left - MARGIN.left;

		setActiveIndex(clampIndex(Math.round(offset / roundWidth)));
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
		const moves: Record<string, (index: number) => number> = {
			ArrowLeft: (index) => index - 1,
			ArrowRight: (index) => index + 1,
			Home: () => 0,
			End: () => lastIndex,
		};
		const move = moves[event.key];

		if (!move) return;

		event.preventDefault();
		setActiveIndex((index) => clampIndex(move(index ?? lastIndex)));
	};

	const toggleFocus = (key: string): void => {
		setFocus((keys) => {
			const next = new Set(keys);

			if (!next.delete(key)) next.add(key);

			return next;
		});
	};

	const activeX = activeIndex === null ? 0 : roundX(activeIndex);
	// The round the tooltip tells, or below a phone's chart the latest one until another is picked
	const readIndex = activeIndex ?? (isWide ? null : lastIndex);
	const readRound = readIndex === null ? undefined : rounds[readIndex];
	const standingAt = (line: TRoundsLine): TAfterRound | null =>
		readIndex === null ? null : line.afterRounds[readIndex];
	const leaderPoints = Math.max(
		0,
		...lines.map((line) => standingAt(line)?.points ?? 0)
	);
	const toRows = (candidates: TRoundsLine[]): TRoundsLine[] =>
		candidates
			.filter((line) => standingAt(line))
			.sort((a, b) => {
				const first = standingAt(a);
				const second = standingAt(b);

				return (
					(first?.position ?? Infinity) -
						(second?.position ?? Infinity) ||
					(second?.points ?? 0) - (first?.points ?? 0)
				);
			});
	// Without a line in colour, the round tells its leader
	const focusedRows = toRows(focusedLines);
	const readRows = focusedRows.length ? focusedRows : toRows(lines).slice(0, 1);

	const readout = readRound && (
		<>
			<p className={chartStyle.tooltipLabel}>{formatRound(readRound)}</p>
			<ul className={chartStyle.tooltipRows}>
				{readRows.map((line) => {
					const standing = standingAt(line);

					return (
						standing && (
							<li
								key={line.key}
								className={chartStyle.tooltipRow}
								style={toLineColors(line.color)}
							>
								<span
									className={cx(
										chartStyle.swatch,
										SWATCH_STYLES[line.dash]
									)}
								/>
								<span className={chartStyle.tooltipPosition}>
									{formatShortPosition({
										position: standing.position,
										isExcluded: false,
									})}
								</span>
								<span className={chartStyle.tooltipName}>
									{isWide ? line.name : line.label}
								</span>
								<span className={chartStyle.tooltipPoints}>
									{formatPoints(standing.points)}
								</span>
								<span className={chartStyle.tooltipGap}>
									{formatGap(standing.points, leaderPoints)}
								</span>
							</li>
						)
					);
				})}
			</ul>
		</>
	);

	// The tooltip opens away from the nearest edge
	const tooltipPosition = {
		...(activeX > width / 2
			? { right: width - activeX + 12 }
			: { left: activeX + 12 }),
		top: MARGIN.top,
	};

	return (
		<div className={chartStyle.container}>
			<div
				ref={chartRef}
				className={chartStyle.chartArea}
				role="group"
				aria-label={`Points after each round of the ${season} ${wording.championship}`}
				tabIndex={0}
				onKeyDown={handleKeyDown}
				onFocus={() => setActiveIndex((index) => index ?? lastIndex)}
				onBlur={() => setActiveIndex(null)}
			>
				<div ref={containerRef} style={{ height }}>
					{width > 0 && (
						<svg
							className={chartStyle.svg}
							width={width}
							height={height}
							aria-hidden="true"
							onPointerMove={handlePointerMove}
							onPointerDown={handlePointerMove}
							// A lifted finger leaves the chart too: only the mouse closes the round by leaving
							onPointerLeave={(event) => {
								if (event.pointerType !== "touch") {
									setActiveIndex(null);
								}
							}}
							// The page took the finger to scroll: no round was read
							onPointerCancel={() => setActiveIndex(null)}
						>
							{pointTicks.map((points) => (
								<g key={points}>
									<line
										className={chartStyle.grid}
										x1={MARGIN.left}
										x2={MARGIN.left + plotWidth}
										y1={pointsY(points)}
										y2={pointsY(points)}
									/>
									<text
										className={chartStyle.axisLabel}
										x={MARGIN.left - 6}
										y={pointsY(points)}
										textAnchor="end"
										dominantBaseline="middle"
									>
										{points}
									</text>
								</g>
							))}
							{roundTicks.map((index) => (
								<text
									key={index}
									className={chartStyle.axisLabel}
									x={roundX(index)}
									y={height - 8}
									textAnchor="middle"
								>
									R{rounds[index].round}
								</text>
							))}
							{activeIndex !== null && (
								<line
									className={chartStyle.crosshair}
									x1={activeX}
									x2={activeX}
									y1={MARGIN.top}
									y2={plotBottom}
								/>
							)}
							{lines
								.filter(({ key }) => !focus.has(key))
								.map((line) => (
									<path
										key={line.key}
										className={chartStyle.line}
										d={linePath(line)}
									/>
								))}
							{/* The first in the standings drawn last, on top */}
							{[...focusedLines].reverse().map((line) => (
								<path
									key={line.key}
									className={chartStyle.focusedLine}
									style={toLineColors(line.color)}
									d={linePath(line)}
									strokeDasharray={DASH_ARRAYS[line.dash]}
								/>
							))}
							{activeIndex !== null &&
								focusedLines.map((line) => {
									const standing =
										line.afterRounds[activeIndex];

									return (
										standing && (
											<circle
												key={line.key}
												className={chartStyle.marker}
												style={toLineColors(line.color)}
												cx={activeX}
												cy={pointsY(standing.points)}
												r={MARKER_RADIUS}
											/>
										)
									);
								})}
							{isLabelled &&
								focusedLines.map(
									(line, index) =>
										endIndexes[index] >= 0 && (
											<text
												key={line.key}
												className={chartStyle.endLabel}
												x={
													roundX(endIndexes[index]) +
													LABEL_GAP
												}
												y={labelYs[index]}
												dominantBaseline="middle"
											>
												{line.label}
											</text>
										)
								)}
						</svg>
					)}
				</div>
				{readout && (
					<div
						className={cx(
							chartStyle.readout,
							isWide ? chartStyle.tooltip : chartStyle.staticReadout
						)}
						style={isWide ? tooltipPosition : undefined}
						aria-live="polite"
					>
						{readout}
					</div>
				)}
			</div>
			<ul className={chartStyle.key}>
				{keyLines.map((line) => (
					<li key={line.key}>
						<HapticButton
							type="button"
							className={chartStyle.keyButton}
							style={toLineColors(line.color)}
							aria-pressed={focus.has(line.key)}
							onClick={() => toggleFocus(line.key)}
						>
							<span
								className={cx(
									focus.has(line.key)
										? chartStyle.swatch
										: chartStyle.dimSwatch,
									SWATCH_STYLES[line.dash]
								)}
							/>
							{line.label}
						</HapticButton>
					</li>
				))}
				{lines.length > KEY_SIZE && (
					<li>
						<HapticButton
							type="button"
							className={chartStyle.keyButton}
							aria-expanded={isKeyOpen}
							onClick={() => setIsKeyOpen((isOpen) => !isOpen)}
						>
							{isKeyOpen
								? "Show fewer"
								: `${hiddenCount} more ${wording.names}`}
						</HapticButton>
					</li>
				)}
			</ul>
			<div className={chartStyle.tableContainer}>
				<table>
					<caption>
						Points after each round of the {season}{" "}
						{wording.championship}
					</caption>
					<thead>
						<tr>
							<th scope="col">{wording.name}</th>
							{rounds.map((round) => (
								<th key={round.round} scope="col">
									{formatRound(round)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{lines.map((line) => (
							<tr key={line.key}>
								<th scope="row">{line.name}</th>
								{line.afterRounds.map((standing, index) => (
									<td key={rounds[index]?.round ?? index}>
										{standing
											? `${formatShortPosition({ position: standing.position, isExcluded: false })}, ${formatPoints(standing.points)}`
											: "Not raced yet"}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
