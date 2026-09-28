import {
	type CSSProperties,
	type FunctionComponent,
	type KeyboardEvent,
	type PointerEvent,
	useState,
} from "react";

import { css } from "@/../styled-system/css";
import { useElementWidth } from "@/hooks/useElementWidth";
import type { TStanding, TTeamIdentity } from "@/types/team";
import {
	findIdentity,
	FIRST_CHAMPIONSHIP_SEASON,
	formatPointsAndWins,
	formatPosition,
	listPositionTicks,
	listSeasonTicks,
} from "@/utils/standings";

type TStandingsChartProps = {
	teamName: string;
	identities: TTeamIdentity[];
	standings: TStanding[];
	firstSeason: number;
	lastSeason: number;
	teamColor: string;
};

// The top margin holds the names, the bottom one the seasons
const MARGIN = { top: 28, right: 8, bottom: 28, left: 32 };
// Room under the last row, for the line not to run along the edge of the names
const PLOT_PADDING_BOTTOM = 10;
const MIN_SEASON_TICK_SPACING = 44;
// A surface gap keeps two names apart, rather than a border
const IDENTITY_GAP = 2;
const IDENTITY_LABEL_PADDING = 6;
// Uppercase label text at 12px: an estimate, a name that may not fit is left to the tooltip and the cards
const IDENTITY_LABEL_CHAR_WIDTH = 8.5;
const TITLE_RADIUS = 5;
const MIN_TITLE_RADIUS = 3;
const MARKER_RADIUS = 4;

// The key and the tooltip draw their markers as the chart does
const markerBefore = {
	content: "\"\"",
	flexShrink: 0,
	width: 2.5,
	height: 2.5,
	borderRadius: "full",
	backgroundColor: "var(--marker-fill)",
	borderWidth: "2px",
	borderColor: "var(--marker-stroke)",
};

const TITLE_MARKER = {
	"--marker-fill": "var(--colors-accent)",
	"--marker-stroke": "var(--colors-accent)",
} as CSSProperties;

const RUNNING_MARKER = {
	"--marker-fill": "var(--colors-surface)",
	"--marker-stroke": "var(--colors-text)",
} as CSSProperties;

// The current name wears the team colour as a wash, the line stays readable over it
const CURRENT_IDENTITY_OPACITY = 0.1;

const chartStyle = {
	container: css({
		position: "relative",
		padding: 3,
		backgroundColor: "surface",
		outline: "none",
		_focusVisible: {
			boxShadow: "0 0 0 2px token(colors.accent)",
		},
		lg: {
			padding: 4,
		},
	}),
	chartArea: css({
		position: "relative",
	}),
	svg: css({
		display: "block",
		overflow: "visible",
		touchAction: "pan-y",
	}),
	formerIdentity: css({
		fill: "surfaceMuted",
	}),
	identityLabel: css({
		fill: "textMuted",
		fontSize: "12px",
		fontWeight: 600,
		letterSpacing: "0.08em",
		textTransform: "uppercase",
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
	line: css({
		fill: "none",
		stroke: "text",
		strokeWidth: 2,
		strokeLinejoin: "round",
		strokeLinecap: "round",
	}),
	point: css({
		fill: "text",
		stroke: "surface",
		strokeWidth: 2,
	}),
	title: css({
		fill: "accent",
		stroke: "surface",
		strokeWidth: 2,
	}),
	running: css({
		fill: "surface",
		stroke: "text",
		strokeWidth: 2,
	}),
	key: css({
		display: "flex",
		flexWrap: "wrap",
		columnGap: 4,
		rowGap: 1,
		marginTop: 2,
	}),
	keyItem: css({
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		color: "textMuted",
		textStyle: "label",
		lg: {
			fontSize: "xs",
		},
		_before: markerBefore,
	}),
	tooltip: css({
		position: "absolute",
		zIndex: 1,
		display: "grid",
		gap: 0.5,
		minWidth: "150px",
		paddingX: 3,
		paddingY: 2,
		backgroundColor: "surface",
		borderWidth: "1px",
		borderColor: "line",
		boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
		pointerEvents: "none",
	}),
	tooltipLabel: css({
		color: "textMuted",
		textStyle: "label",
		lg: {
			fontSize: "xs",
		},
	}),
	tooltipValue: css({
		textStyle: "figure",
		fontSize: "xl",
	}),
	tooltipDetail: css({
		fontSize: "sm",
		lg: {
			fontSize: "sm",
		},
	}),
	tooltipNote: css({
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		fontSize: "sm",
		fontWeight: 600,
		lg: {
			fontSize: "sm",
		},
		_before: markerBefore,
	}),
	table: css({
		srOnly: true,
	}),
};

export const StandingsChart: FunctionComponent<TStandingsChartProps> = ({
	teamName,
	identities,
	standings,
	firstSeason,
	lastSeason,
	teamColor,
}: TStandingsChartProps) => {
	const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>();
	const [activeSeason, setActiveSeason] = useState<number | null>(null);

	const standingsBySeason = new Map(
		standings.map((standing) => [standing.season, standing])
	);

	const width = containerWidth;
	const height = Math.round(Math.min(320, Math.max(220, width * 0.4)));
	const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
	const plotHeight =
		height - MARGIN.top - MARGIN.bottom - PLOT_PADDING_BOTTOM;
	const plotBottom = MARGIN.top + plotHeight;
	const bandsBottom = plotBottom + PLOT_PADDING_BOTTOM;

	const seasonsCount = lastSeason - firstSeason + 1;
	const seasonWidth = plotWidth / seasonsCount;
	const seasonStartX = (season: number): number =>
		MARGIN.left + (season - firstSeason) * seasonWidth;
	const seasonX = (season: number): number =>
		seasonStartX(season) + seasonWidth / 2;
	// Titles in a row stay apart on a narrow chart
	const titleRadius = Math.max(
		MIN_TITLE_RADIUS,
		Math.min(TITLE_RADIUS, seasonWidth / 2)
	);

	const positions = standings
		.map(({ position }) => position)
		.filter((position): position is number => position !== null);
	const lowestPosition = Math.max(2, ...positions);
	const hasUnclassified = standings.some(({ position }) => position === null);
	// Unclassified seasons sit on their own row, set apart below the last place
	const unclassifiedRow = lowestPosition + 1.5;
	const lastRow = hasUnclassified ? unclassifiedRow : lowestPosition;
	const rowY = (row: number): number =>
		MARGIN.top + ((row - 1) / (lastRow - 1)) * plotHeight;
	const standingY = ({ position }: TStanding): number =>
		rowY(position ?? unclassifiedRow);

	const linePath = standings
		.map((standing, index) => {
			const isFollowing =
				index > 0 &&
				standings[index - 1].season === standing.season - 1;

			return `${isFollowing ? "L" : "M"}${seasonX(standing.season)},${standingY(standing)}`;
		})
		.join("");
	// A season without a neighbour draws no line: it needs a point to show
	const isolatedStandings = standings.filter(
		({ season }) =>
			!standingsBySeason.has(season - 1) &&
			!standingsBySeason.has(season + 1)
	);

	const identityBands = identities.flatMap((identity) => {
		const start = Math.max(identity.yearOfStart, firstSeason);
		const end = Math.min(identity.yearOfEnd ?? lastSeason, lastSeason);

		if (end < start) return [];

		const x = seasonStartX(start) + IDENTITY_GAP / 2;
		const bandWidth = Math.max(
			1,
			(end - start + 1) * seasonWidth - IDENTITY_GAP
		);
		const isLabelled =
			identity.name.length * IDENTITY_LABEL_CHAR_WIDTH +
				IDENTITY_LABEL_PADDING * 2 <=
			bandWidth;

		return [
			{
				identity,
				x,
				bandWidth,
				isLabelled,
				isCurrent: identity.yearOfEnd === null,
			},
		];
	});

	const seasonTicks = listSeasonTicks(
		firstSeason,
		lastSeason,
		seasonWidth,
		MIN_SEASON_TICK_SPACING
	);
	const positionTicks = listPositionTicks(lowestPosition);

	const activeStanding =
		activeSeason === null ? undefined : standingsBySeason.get(activeSeason);
	const activeIdentity =
		activeSeason === null
			? undefined
			: findIdentity(identities, activeSeason);
	const hasTitles = standings.some(({ isTitle }) => isTitle);
	const lastStanding = standings[standings.length - 1];
	const runningStanding =
		lastStanding && !lastStanding.isFinal ? lastStanding : undefined;

	const clampSeason = (season: number): number =>
		Math.min(lastSeason, Math.max(firstSeason, season));

	const handlePointerMove = (event: PointerEvent<SVGSVGElement>): void => {
		const { left } = event.currentTarget.getBoundingClientRect();
		const offset = event.clientX - left - MARGIN.left;

		setActiveSeason(
			clampSeason(firstSeason + Math.floor(offset / seasonWidth))
		);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
		const moves: Record<string, (season: number) => number> = {
			ArrowLeft: (season) => season - 1,
			ArrowRight: (season) => season + 1,
			Home: () => firstSeason,
			End: () => lastSeason,
		};
		const move = moves[event.key];

		if (!move) return;

		event.preventDefault();
		setActiveSeason((season) => clampSeason(move(season ?? lastSeason)));
	};

	const activeX = activeSeason === null ? 0 : seasonX(activeSeason);
	// The tooltip opens away from the nearest edge, and from the point it describes
	const isActiveHigh =
		!activeStanding ||
		standingY(activeStanding) < MARGIN.top + plotHeight / 2;
	const tooltipPosition = {
		...(activeX > width / 2
			? { right: width - activeX + 12 }
			: { left: activeX + 12 }),
		...(isActiveHigh
			? { bottom: height - bandsBottom }
			: { top: MARGIN.top }),
	};

	const describeMissingStanding = (season: number): string =>
		season < FIRST_CHAMPIONSHIP_SEASON
			? "No constructors' championship yet"
			: "No standing";

	return (
		<div
			className={chartStyle.container}
			role="group"
			aria-label={`${teamName}'s constructors' championship position by season, from ${firstSeason} to ${lastSeason}`}
			tabIndex={0}
			onKeyDown={handleKeyDown}
			onFocus={() => setActiveSeason((season) => season ?? lastSeason)}
			onBlur={() => setActiveSeason(null)}
		>
			<div
				ref={containerRef}
				className={chartStyle.chartArea}
				style={{ height }}
			>
				{width > 0 && (
					<svg
						className={chartStyle.svg}
						width={width}
						height={height}
						aria-hidden="true"
						onPointerMove={handlePointerMove}
						onPointerDown={handlePointerMove}
						onPointerLeave={() => setActiveSeason(null)}
					>
						{identityBands.map(
							({
								identity,
								x,
								bandWidth,
								isLabelled,
								isCurrent,
							}) => (
								<g key={identity.id}>
									<rect
										className={
											isCurrent
												? undefined
												: chartStyle.formerIdentity
										}
										x={x}
										y={0}
										width={bandWidth}
										height={bandsBottom}
										fill={isCurrent ? teamColor : undefined}
										fillOpacity={
											isCurrent
												? CURRENT_IDENTITY_OPACITY
												: undefined
										}
									/>
									{isLabelled && (
										<text
											className={chartStyle.identityLabel}
											x={x + IDENTITY_LABEL_PADDING}
											y={18}
										>
											{identity.name}
										</text>
									)}
								</g>
							)
						)}
						{positionTicks.map((position) => (
							<g key={position}>
								<line
									className={chartStyle.grid}
									x1={MARGIN.left}
									x2={width - MARGIN.right}
									y1={rowY(position)}
									y2={rowY(position)}
								/>
								<text
									className={chartStyle.axisLabel}
									x={MARGIN.left - 6}
									y={rowY(position)}
									textAnchor="end"
									dominantBaseline="middle"
								>
									P{position}
								</text>
							</g>
						))}
						{hasUnclassified && (
							<g>
								<line
									className={chartStyle.grid}
									x1={MARGIN.left}
									x2={width - MARGIN.right}
									y1={rowY(unclassifiedRow)}
									y2={rowY(unclassifiedRow)}
								/>
								<text
									className={chartStyle.axisLabel}
									x={MARGIN.left - 6}
									y={rowY(unclassifiedRow)}
									textAnchor="end"
									dominantBaseline="middle"
								>
									NC
								</text>
							</g>
						)}
						{seasonTicks.map((season) => (
							<text
								key={season}
								className={chartStyle.axisLabel}
								x={seasonX(season)}
								y={height - 8}
								textAnchor="middle"
							>
								{season}
							</text>
						))}
						{activeSeason !== null && (
							<line
								className={chartStyle.crosshair}
								x1={activeX}
								x2={activeX}
								y1={MARGIN.top}
								y2={bandsBottom}
							/>
						)}
						<path className={chartStyle.line} d={linePath} />
						{isolatedStandings.map((standing) => (
							<circle
								key={standing.season}
								className={chartStyle.point}
								cx={seasonX(standing.season)}
								cy={standingY(standing)}
								r={MARKER_RADIUS}
							/>
						))}
						{standings
							.filter(({ isTitle }) => isTitle)
							.map((standing) => (
								<circle
									key={standing.season}
									className={chartStyle.title}
									cx={seasonX(standing.season)}
									cy={standingY(standing)}
									r={titleRadius}
								/>
							))}
						{runningStanding && (
							<circle
								className={chartStyle.running}
								cx={seasonX(runningStanding.season)}
								cy={standingY(runningStanding)}
								r={MARKER_RADIUS}
							/>
						)}
						{activeStanding && (
							<circle
								className={
									activeStanding.isTitle
										? chartStyle.title
										: chartStyle.point
								}
								cx={activeX}
								cy={standingY(activeStanding)}
								r={
									activeStanding.isTitle
										? titleRadius + 1
										: MARKER_RADIUS
								}
							/>
						)}
					</svg>
				)}
				{activeSeason !== null && (
					<div
						className={chartStyle.tooltip}
						style={tooltipPosition}
						aria-live="polite"
					>
						<p className={chartStyle.tooltipLabel}>
							{activeSeason}
							{activeIdentity && ` · ${activeIdentity.name}`}
						</p>
						{activeStanding ? (
							<>
								<p className={chartStyle.tooltipValue}>
									{formatPosition(activeStanding)}
								</p>
								<p className={chartStyle.tooltipDetail}>
									{formatPointsAndWins(activeStanding)}
								</p>
							</>
						) : (
							<p className={chartStyle.tooltipDetail}>
								{describeMissingStanding(activeSeason)}
							</p>
						)}
						{activeStanding?.isTitle && (
							<p
								className={chartStyle.tooltipNote}
								style={TITLE_MARKER}
							>
								Constructors' champion
							</p>
						)}
						{activeStanding && !activeStanding.isFinal && (
							<p
								className={chartStyle.tooltipNote}
								style={RUNNING_MARKER}
							>
								Season in progress
							</p>
						)}
					</div>
				)}
			</div>
			{(hasTitles || runningStanding) && (
				<ul className={chartStyle.key}>
					{hasTitles && (
						<li className={chartStyle.keyItem} style={TITLE_MARKER}>
							Constructors' title
						</li>
					)}
					{runningStanding && (
						<li
							className={chartStyle.keyItem}
							style={RUNNING_MARKER}
						>
							Season in progress
						</li>
					)}
				</ul>
			)}
			<table className={chartStyle.table}>
				<caption>
					{teamName}'s constructors' championship position by season
				</caption>
				<thead>
					<tr>
						<th scope="col">Season</th>
						<th scope="col">Team name</th>
						<th scope="col">Position</th>
						<th scope="col">Points and wins</th>
					</tr>
				</thead>
				<tbody>
					{standings.map((standing) => (
						<tr key={standing.season}>
							<th scope="row">{standing.season}</th>
							<td>
								{
									findIdentity(identities, standing.season)
										?.name
								}
							</td>
							<td>
								{formatPosition(standing)}
								{standing.isTitle && ", constructors' champion"}
								{!standing.isFinal && ", season in progress"}
							</td>
							<td>{formatPointsAndWins(standing)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
