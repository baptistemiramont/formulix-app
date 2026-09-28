import {
	type FunctionComponent,
	type PropsWithChildren,
	useEffect,
} from "react";

import { Link, useParams } from "@tanstack/react-router";

import { css } from "@/../styled-system/css";
import { StatCard } from "@/components/cards/StatCard";
import { CircuitLayout } from "@/components/CircuitLayout";
import { Error } from "@/components/Error";
import { Loader } from "@/components/Loader";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import type { TCircuitDetailed } from "@/types/circuit";
import { formatLeaders, getLayoutUrl, toFlagUrl } from "@/utils/circuit";
import { ROUTES } from "@/utils/constants";

type TWinner = TCircuitDetailed["grandsPrix"][number]["winners"][number];

const linkStyle = css({
	textDecoration: "underline",
	textDecorationColor: "accent",
	textUnderlineOffset: "3px",
	transition: "var(--default-animation)",
	_hover: {
		color: "accentText",
	},
});

const NameLink: FunctionComponent<
	PropsWithChildren<{ to: string; params: object }>
> = ({ to, params, children }) => (
	<Link to={to} params={params} className={linkStyle}>
		{children}
	</Link>
);

const DriverName: FunctionComponent<{ name: string; slug: string | null }> = ({
	name,
	slug,
}) =>
	slug ? (
		<NameLink to={ROUTES.DRIVER} params={{ driverSlug: slug }}>
			{name}
		</NameLink>
	) : (
		<>{name}</>
	);

const TeamNames: FunctionComponent<{ winners: TWinner[] }> = ({ winners }) => {
	// Drivers sharing the winning car raced for the same team: named once
	const teams = [
		...new Map(winners.map(({ team }) => [team.name, team])).values(),
	];

	return teams.map(({ name, slug }, index) => (
		<span key={name}>
			{index > 0 && " / "}
			{slug ? (
				<NameLink to={ROUTES.TEAM} params={{ teamSlug: slug }}>
					{name}
				</NameLink>
			) : (
				name
			)}
		</span>
	));
};

export const Circuit: FunctionComponent = () => {
	const { circuitSlug } = useParams({ from: ROUTES.CIRCUIT });
	const { setCircuitSlug, isCircuitLoading, circuit, circuitError } =
		useData();

	useEffect(() => {
		if (circuitSlug) {
			setCircuitSlug(circuitSlug);
		}
	}, [circuitSlug, setCircuitSlug]);

	if (isCircuitLoading) return <Loader />;

	if (circuitError)
		return (
			<Error message="An error has occurred while fetching the circuit data" />
		);

	if (!circuit) return <Error message="No circuit data found" />;

	const {
		isActive,
		name,
		slug,
		locality,
		country,
		countryCode,
		grandsPrixCount,
		firstSeason,
		lastSeason,
		grandPrixNames,
		mostWins,
		mostPoles,
		grandsPrix,
	} = circuit;

	// A single name would repeat on every line
	const hasSeveralNames = grandPrixNames.length > 1;

	const layoutUrl = getLayoutUrl(slug);
	const flagUrl = toFlagUrl(countryCode);

	const circuitPageStyle = {
		container: {
			paddingTop: 4,
			paddingBottom: 12,
			display: "grid",
			gap: 8,
			lg: {
				gap: 12,
			},
		},
		circuitMainInfosContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gridTemplateColumns: "1fr 1fr",
				alignItems: "center",
			},
		},
		circuitPortraitContainer: {
			display: "grid",
			justifyItems: "center",
			gap: 2,
			textAlign: "center",
		},
		circuitFlagContainer: {
			display: "grid",
			justifyContent: "center",
			padding: 6,
			backgroundColor: "plate",
			borderTopWidth: "2px",
			borderRightWidth: "2px",
			borderColor: "accent",
			borderTopRightRadius: "2xl",
		},
		circuitFlag: {
			// A thin line keeps the white of a flag apart from the plate
			boxShadow: "0 0 0 1px token(colors.line)",
		},
		circuitLayoutContainer: {
			position: "relative",
			width: "250px",
			aspectRatio: "1",
			padding: 6,
			color: "text",
			backgroundColor: "surface",
			borderTopWidth: "2px",
			borderRightWidth: "2px",
			borderColor: "accent",
			borderTopRightRadius: "2xl",
			lg: {
				width: "300px",
			},
		},
		circuitLayoutFlag: {
			position: "absolute",
			top: 3,
			left: 3,
			width: 10,
			height: "auto",
			borderRadius: "2px",
			boxShadow: "0 0 0 1px token(colors.line)",
		},
		circuitLocation: {
			color: "textMuted",
			textStyle: "label",
		},
		circuitStatList: {
			display: "grid",
			gap: 3,
		},
		grandsPrixContainer: {
			display: "grid",
			gap: 4,
			lg: {
				gap: 8,
			},
		},
		grandsPrixTable: {
			// Rows stack as cards on small screens: a table layout would keep them as wide as their content
			display: "block",
			width: "full",
			borderCollapse: "collapse",
			textAlign: "left",
			lg: {
				display: "table",
			},
		},
		grandsPrixHead: {
			display: "none",
			lg: {
				display: "table-header-group",
			},
		},
		grandsPrixHeadCell: {
			paddingX: 3,
			paddingY: 2,
			color: "textMuted",
			textStyle: "label",
			borderBottomWidth: "1px",
			borderColor: "line",
		},
		grandsPrixBody: {
			display: "grid",
			gap: 3,
			lg: {
				display: "table-row-group",
			},
		},
		grandPrixRow: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 2,
			padding: 3,
			backgroundColor: "surface",
			lg: {
				display: "table-row",
				padding: 0,
				backgroundColor: "transparent",
				borderBottomWidth: "1px",
				borderColor: "line",
			},
		},
		grandPrixCell: {
			display: "grid",
			alignContent: "start",
			lg: {
				display: "table-cell",
				paddingX: 3,
				paddingY: 3,
			},
			_before: {
				content: "attr(data-label)",
				color: "textMuted",
				textStyle: "label",
				lg: {
					content: "none",
				},
			},
		},
		grandPrixSeason: {
			gridColumn: "1 / -1",
			textStyle: "figure",
			fontSize: "xl",
			_before: {
				display: "none",
			},
		},
	};

	const grandsPrixRows = grandsPrix.map(
		({ season, round, name: grandPrixName, pole, winners }) => (
			<tr
				key={`${season}-${round}`}
				className={css(circuitPageStyle.grandPrixRow)}
			>
				<td
					className={css(
						circuitPageStyle.grandPrixCell,
						circuitPageStyle.grandPrixSeason
					)}
				>
					{season}
				</td>
				{hasSeveralNames && (
					<td
						data-label="Grand Prix"
						className={css(circuitPageStyle.grandPrixCell, {
							gridColumn: "1 / -1",
						})}
					>
						{grandPrixName}
					</td>
				)}
				<td
					data-label="Winner"
					className={css(circuitPageStyle.grandPrixCell)}
				>
					<span>
						{winners.map(({ name, slug }, index) => (
							<span key={name}>
								{index > 0 && " / "}
								<DriverName name={name} slug={slug} />
							</span>
						))}
					</span>
				</td>
				<td
					data-label="Team"
					className={css(circuitPageStyle.grandPrixCell)}
				>
					<span>
						<TeamNames winners={winners} />
					</span>
				</td>
				<td
					data-label="Pole position"
					className={css(circuitPageStyle.grandPrixCell)}
				>
					<span>
						{pole ? (
							<DriverName name={pole.name} slug={pole.slug} />
						) : (
							"-"
						)}
					</span>
				</td>
			</tr>
		)
	);

	return (
		<section className={css(layoutGutters, circuitPageStyle.container)}>
			<div className={css(circuitPageStyle.circuitMainInfosContainer)}>
				<div className={css(circuitPageStyle.circuitPortraitContainer)}>
					{layoutUrl ? (
						<div
							className={css(
								circuitPageStyle.circuitLayoutContainer
							)}
						>
							<CircuitLayout
								url={layoutUrl}
								label={`${name}'s layout`}
							/>
							<img
								className={css(
									circuitPageStyle.circuitLayoutFlag
								)}
								src={flagUrl}
								alt={`${country}'s flag`}
								width="40"
							/>
						</div>
					) : (
						<div
							className={css(
								circuitPageStyle.circuitFlagContainer
							)}
						>
							<img
								className={css(circuitPageStyle.circuitFlag)}
								src={flagUrl}
								alt={`${country}'s flag`}
								width="200"
								loading="lazy"
							/>
						</div>
					)}
					<h1>{name}</h1>
					<p className={css(circuitPageStyle.circuitLocation)}>
						{locality}, {country}
					</p>
					{hasSeveralNames && <p>{grandPrixNames.join(" · ")}</p>}
				</div>
				<ul className={css(circuitPageStyle.circuitStatList)}>
					<StatCard
						label="Status"
						value={isActive ? "Active" : "Inactive"}
					/>
					<StatCard
						label="Grands Prix hosted"
						value={grandsPrixCount}
					/>
					<StatCard
						label="First Grand Prix"
						value={firstSeason ?? "-"}
					/>
					<StatCard
						label="Last Grand Prix"
						value={lastSeason ?? "-"}
					/>
					<StatCard
						label="Most wins"
						value={formatLeaders(mostWins)}
					/>
					<StatCard
						label="Most pole positions"
						value={formatLeaders(mostPoles)}
					/>
				</ul>
			</div>
			{grandsPrix.length > 0 && (
				<div className={css(circuitPageStyle.grandsPrixContainer)}>
					<h2 className={css(cornerTitle)}>Winners</h2>
					<table className={css(circuitPageStyle.grandsPrixTable)}>
						<thead className={css(circuitPageStyle.grandsPrixHead)}>
							<tr>
								<th
									className={css(
										circuitPageStyle.grandsPrixHeadCell
									)}
								>
									Season
								</th>
								{hasSeveralNames && (
									<th
										className={css(
											circuitPageStyle.grandsPrixHeadCell
										)}
									>
										Grand Prix
									</th>
								)}
								<th
									className={css(
										circuitPageStyle.grandsPrixHeadCell
									)}
								>
									Winner
								</th>
								<th
									className={css(
										circuitPageStyle.grandsPrixHeadCell
									)}
								>
									Team
								</th>
								<th
									className={css(
										circuitPageStyle.grandsPrixHeadCell
									)}
								>
									Pole position
								</th>
							</tr>
						</thead>
						<tbody className={css(circuitPageStyle.grandsPrixBody)}>
							{grandsPrixRows}
						</tbody>
					</table>
				</div>
			)}
		</section>
	);
};
