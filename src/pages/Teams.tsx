import { type FunctionComponent, type ReactNode } from "react";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { Error } from "@/components/Error";
import { FilterPanel } from "@/components/form/FilterPanel";
import { SegmentedControl } from "@/components/form/SegmentedControl";
import { ToggleButton } from "@/components/form/ToggleButton";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { useFilter } from "@/hooks/useFilter";
import { useListPage } from "@/hooks/useListPage";
import { usePage } from "@/hooks/usePage";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { teamSchema } from "@/types/schemas/team";
import {
	FILTER_STORAGE_KEYS,
	PAGE_STORAGE_KEYS,
	STATUS_OPTIONS,
} from "@/utils/constants";
import { toTeamColor } from "@/utils/team";

export const Teams: FunctionComponent = () => {
	const [search, setSearch] = useFilter(FILTER_STORAGE_KEYS.TEAMS_SEARCH);
	const [status, setStatus] = useFilter(FILTER_STORAGE_KEYS.TEAMS_STATUS);
	const [titled, setTitled] = useFilter(FILTER_STORAGE_KEYS.TEAMS_TITLED);
	const [page, setPage] = usePage(PAGE_STORAGE_KEYS.TEAMS);
	const searchQuery = useSearchQuery(search);

	const { data, error, isPlaceholderData } = useListPage(
		"teams",
		{ page, search: searchQuery, status, titled },
		teamSchema
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
		[setSearch, setStatus, setTitled].forEach((setFilter) => setFilter(""));
		setPage(1);
	}

	const teamsPageStyle = {
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

	function renderTeams(): ReactNode {
		if (!data) {
			return error ? <Error message="An error has occurred" /> : <Loader />;
		}

		if (data.data.length === 0) {
			return <p>No teams match the search and filters.</p>;
		}

		return (
			<ul
				aria-busy={isPlaceholderData}
				className={css(teamsPageStyle.teamListStyle)}
			>
				{data.data.map(({ id, isActive, name, slug, logo, color }) => (
					<Card
						key={id}
						title={name}
						image={logo}
						imageAlt={`${name}'s logo`}
						imageType="logo"
						linkPath={`/teams/${slug}`}
						linkParams={{ teamSlug: slug }}
						subtitle={isActive ? "Active" : "Inactive"}
						accentColor={toTeamColor(color)}
					/>
				))}
			</ul>
		);
	}

	return (
		<section className={css(layoutGutters, teamsPageStyle.container)}>
			<h1 className={css(cornerTitle)}>Teams</h1>
			<FilterPanel
				search={{
					id: "teams-search",
					label: "Search a team",
					value: search,
					onChange: (value) => changeFilter(setSearch, value),
				}}
				total={data?.meta.total}
				itemName={{ one: "team", other: "teams" }}
				isFiltered={Boolean(search || status || titled)}
				onClear={clearFilters}
			>
				<SegmentedControl
					id="teams-status"
					label="Status"
					options={STATUS_OPTIONS}
					value={status}
					onChange={(value) => changeFilter(setStatus, value)}
				/>
				<ToggleButton
					label="Constructors' champions"
					icon="mdi:trophy-outline"
					pressed={titled === "true"}
					onChange={(pressed) =>
						changeFilter(setTitled, pressed ? "true" : "")
					}
				/>
			</FilterPanel>
			{renderTeams()}
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
