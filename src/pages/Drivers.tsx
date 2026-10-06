import { type FunctionComponent, type ReactNode } from "react";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { Error } from "@/components/Error";
import { FilterPanel } from "@/components/form/FilterPanel";
import { Select } from "@/components/form/Select";
import { ToggleButton } from "@/components/form/ToggleButton";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { useData } from "@/hooks/useData";
import { useFilter } from "@/hooks/useFilter";
import { useListPage } from "@/hooks/useListPage";
import { usePage } from "@/hooks/usePage";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { driverSchema } from "@/types/schemas/driver";
import { FILTER_STORAGE_KEYS, PAGE_STORAGE_KEYS } from "@/utils/constants";
import { toPortraitType } from "@/utils/driver";
import { toSelectOptions } from "@/utils/list";
import { OFFLINE_MESSAGES } from "@/utils/offline";
import { getTeamColor } from "@/utils/team";

export const Drivers: FunctionComponent = () => {
	const { teams } = useData();
	const [search, setSearch] = useFilter(FILTER_STORAGE_KEYS.DRIVERS_SEARCH);
	const [team, setTeam] = useFilter(FILTER_STORAGE_KEYS.DRIVERS_TEAM);
	const [nationality, setNationality] = useFilter(
		FILTER_STORAGE_KEYS.DRIVERS_NATIONALITY
	);
	const [champion, setChampion] = useFilter(
		FILTER_STORAGE_KEYS.DRIVERS_CHAMPION
	);
	const [page, setPage] = usePage(PAGE_STORAGE_KEYS.DRIVERS);
	const searchQuery = useSearchQuery(search);

	const { data, error, isPlaceholderData } = useListPage(
		"drivers",
		{ page, search: searchQuery, team, nationality, champion },
		driverSchema
	);

	// Another search or filter makes another list: it starts from its first page
	function changeFilter(
		setFilter: (value: string) => void,
		value: string
	): void {
		setFilter(value);
		setPage(1);
	}

	function clearFilters(): void {
		[setSearch, setTeam, setNationality, setChampion].forEach((setFilter) =>
			setFilter("")
		);
		setPage(1);
	}

	const driversPageStyle = {
		container: {
			paddingY: 12,
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			gap: 6,
		},
		teamListStyle: {
			display: "grid",
			gap: 6,
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			transition: "var(--default-animation)",
			// The previous page, while the next one is on its way
			"&[aria-busy=true]": {
				opacity: 0.5,
			},
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			},
		},
	};

	function renderDrivers(): ReactNode {
		if (!data) {
			return error ? (
				<Error
					message="Failed to load drivers data"
					offlineMessage={
						searchQuery || team || nationality || champion
							? OFFLINE_MESSAGES.SEARCH
							: undefined
					}
				/>
			) : (
				<Loader />
			);
		}

		if (data.data.length === 0) {
			return <p>No drivers match the search and filters.</p>;
		}

		return (
			<ul
				aria-busy={isPlaceholderData}
				className={css(driversPageStyle.teamListStyle)}
			>
				{data.data.map(
					({
						id,
						firstName,
						lastName,
						slug,
						avatar,
						avatarCredit,
						currentTeam,
					}) => (
						<Card
							key={id}
							title={`${firstName} ${lastName}`}
							image={avatar}
							imageAlt={`${firstName} ${lastName}'s avatar`}
							imageType={toPortraitType(avatarCredit)}
							linkPath="/drivers/$driverSlug"
							linkParams={{ driverSlug: slug }}
							subtitle={
								currentTeam ? currentTeam.name : "No team/Inactive"
							}
							accentColor={getTeamColor(teams, currentTeam?.slug)}
						/>
					)
				)}
			</ul>
		);
	}

	return (
		<section className={css(layoutGutters, driversPageStyle.container)}>
			<h1 className={css(cornerTitle)}>Drivers</h1>
			<FilterPanel
				search={{
					id: "drivers-search",
					label: "Search a driver",
					value: search,
					onChange: (value) => changeFilter(setSearch, value),
				}}
				total={data?.meta.total}
				itemName={{ one: "driver", other: "drivers" }}
				isFiltered={Boolean(search || team || nationality || champion)}
				onClear={clearFilters}
			>
				<Select
					id="teams"
					label="Team"
					defaultOptionLabel="All"
					options={toSelectOptions(
						data?.meta.filters.team,
						"No team/Inactive"
					)}
					value={team}
					changeHandler={(event) =>
						changeFilter(setTeam, event.target.value)
					}
				/>
				<Select
					id="nationalities"
					label="Nationality"
					defaultOptionLabel="All"
					options={toSelectOptions(data?.meta.filters.nationality)}
					value={nationality}
					changeHandler={(event) =>
						changeFilter(setNationality, event.target.value)
					}
				/>
				<ToggleButton
					label="World champions"
					icon="mdi:trophy-outline"
					pressed={champion === "true"}
					onChange={(pressed) =>
						changeFilter(setChampion, pressed ? "true" : "")
					}
				/>
			</FilterPanel>
			{renderDrivers()}
			{data && (
				<Pagination
					page={data.meta.page}
					pageCount={data.meta.pageCount}
					onPageChange={setPage}
				/>
			)}
		</section>
	);
};
