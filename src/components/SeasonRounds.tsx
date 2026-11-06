import { type FunctionComponent, useState } from "react";

import { css } from "@/../styled-system/css";
import { Error } from "@/components/Error";
import { Select } from "@/components/form/Select";
import { Loader } from "@/components/Loader";
import { RoundsChart } from "@/components/RoundsChart";
import { useConstructorsChampionship } from "@/hooks/useConstructorsChampionship";
import { useDriversChampionship } from "@/hooks/useDriversChampionship";
import type { TChampionship, TRound } from "@/types/standing";
import {
	listConstructorLines,
	listDriverLines,
	type TRoundsLine,
} from "@/utils/rounds";

type TSeasonRoundsProps = {
	// The driver's or the team's slug
	slug: string;
	// The seasons the driver or the team has a standing in, in order
	seasons: number[];
};

type TSeasonRoundsViewProps = {
	championship: TChampionship;
	slug: string;
	// Null for the latest of the seasons
	season: number | null;
	seasons: number[];
	onSeasonChange: (season: number | null) => void;
	isLoading: boolean;
	error: unknown;
	championshipData?: {
		season: number;
		rounds: TRound[];
		lines: TRoundsLine[];
	};
};

const seasonRoundsStyle = {
	container: css({
		display: "grid",
		gap: 4,
	}),
	header: css({
		display: "flex",
		flexWrap: "wrap",
		alignItems: "end",
		justifyContent: "space-between",
		gap: 4,
	}),
	caption: css({
		color: "textMuted",
		textStyle: "label",
	}),
	note: css({
		color: "textMuted",
	}),
};

const SeasonRoundsView: FunctionComponent<TSeasonRoundsViewProps> = ({
	championship,
	slug,
	season,
	seasons,
	onSeasonChange,
	isLoading,
	error,
	championshipData,
}) => {
	const latestSeason = seasons[seasons.length - 1];
	const shownSeason = season ?? latestSeason;
	const seasonOptions = seasons
		.filter((option) => option !== latestSeason)
		.reverse()
		.map((option) => ({ label: String(option), value: String(option) }));

	// The driver and their teammates, or the team
	const team = championshipData?.lines.find(({ key }) => key === slug)?.team;
	const initialFocus = (championshipData?.lines ?? [])
		.filter((line) => line.key === slug || line.team === team)
		.map(({ key }) => key);

	let chart;

	if (error) {
		chart = <Error message="Failed to load the season" />;
	} else if (
		isLoading ||
		!championshipData ||
		// Still the season shown before, until the one asked for arrives
		championshipData.season !== shownSeason
	) {
		chart = <Loader />;
	} else if (championshipData.rounds.length < 2) {
		chart = (
			<p className={seasonRoundsStyle.note}>
				No points to follow round by round in {shownSeason}.
			</p>
		);
	} else {
		chart = (
			<RoundsChart
				// Another season lights up its own lines
				key={shownSeason}
				championship={championship}
				season={shownSeason}
				rounds={championshipData.rounds}
				lines={championshipData.lines}
				initialFocus={initialFocus}
			/>
		);
	}

	return (
		<div className={seasonRoundsStyle.container}>
			<div className={seasonRoundsStyle.header}>
				<p className={seasonRoundsStyle.caption}>
					Points after each round
				</p>
				{seasons.length > 1 && (
					<Select
						id={`${championship}-rounds-season`}
						label="Season"
						defaultOptionLabel={String(latestSeason)}
						options={seasonOptions}
						value={season === null ? "" : String(season)}
						changeHandler={(event) =>
							onSeasonChange(
								event.target.value
									? Number(event.target.value)
									: null
							)
						}
					/>
				)}
			</div>
			{chart}
		</div>
	);
};

export const DriverSeasonRounds: FunctionComponent<TSeasonRoundsProps> = ({
	slug,
	seasons,
}) => {
	const [season, setSeason] = useState<number | null>(null);
	const { data, isLoading, error } = useDriversChampionship(
		season ?? seasons[seasons.length - 1]
	);

	return (
		<SeasonRoundsView
			championship="drivers"
			slug={slug}
			season={season}
			seasons={seasons}
			onSeasonChange={setSeason}
			isLoading={isLoading}
			error={error}
			championshipData={
				data && {
					season: data.season,
					rounds: data.rounds,
					lines: listDriverLines(data),
				}
			}
		/>
	);
};

export const TeamSeasonRounds: FunctionComponent<TSeasonRoundsProps> = ({
	slug,
	seasons,
}) => {
	const [season, setSeason] = useState<number | null>(null);
	const { data, isLoading, error } = useConstructorsChampionship(
		season ?? seasons[seasons.length - 1]
	);

	return (
		<SeasonRoundsView
			championship="constructors"
			slug={slug}
			season={season}
			seasons={seasons}
			onSeasonChange={setSeason}
			isLoading={isLoading}
			error={error}
			championshipData={
				data && {
					season: data.season,
					rounds: data.rounds,
					lines: listConstructorLines(data),
				}
			}
		/>
	);
};
