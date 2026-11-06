import {
	type FunctionComponent,
	lazy,
	type ReactNode,
	Suspense,
} from "react";

import { css } from "@/../styled-system/css";
import { CircuitCard } from "@/components/cards/CircuitCard";
import { Error } from "@/components/Error";
import { FilterPanel } from "@/components/form/FilterPanel";
import { SegmentedControl } from "@/components/form/SegmentedControl";
import { Select } from "@/components/form/Select";
import { IconSwitch } from "@/components/IconSwitch";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { useCircuitsOnMap } from "@/hooks/useCircuitsOnMap";
import { useFilter } from "@/hooks/useFilter";
import { useListPage } from "@/hooks/useListPage";
import { usePage } from "@/hooks/usePage";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { circuitSchema } from "@/types/schemas/circuit";
import {
	CIRCUITS_VIEWS,
	FILTER_STORAGE_KEYS,
	PAGE_STORAGE_KEYS,
	STATUS_OPTIONS,
} from "@/utils/constants";
import { toSelectOptions } from "@/utils/list";
import { OFFLINE_MESSAGES } from "@/utils/offline";

// Loaded once chosen, with the world it draws: the list does without it
const CircuitsMap = lazy(() =>
	import("@/components/CircuitsMap").then(({ CircuitsMap }) => ({
		default: CircuitsMap,
	}))
);

type TCircuitsView = (typeof CIRCUITS_VIEWS)[keyof typeof CIRCUITS_VIEWS];

const VIEW_OPTIONS: { value: TCircuitsView; label: string; icon: string }[] =
	[
		{ value: CIRCUITS_VIEWS.LIST, label: "List", icon: "mdi:view-grid-outline" },
		{ value: CIRCUITS_VIEWS.MAP, label: "World map", icon: "mdi:map-outline" },
	];

export const Circuits: FunctionComponent = () => {
	const [search, setSearch] = useFilter(FILTER_STORAGE_KEYS.CIRCUITS_SEARCH);
	const [status, setStatus] = useFilter(FILTER_STORAGE_KEYS.CIRCUITS_STATUS);
	const [country, setCountry] = useFilter(
		FILTER_STORAGE_KEYS.CIRCUITS_COUNTRY
	);
	const [view, setView] = useFilter(FILTER_STORAGE_KEYS.CIRCUITS_VIEW);
	const [page, setPage] = usePage(PAGE_STORAGE_KEYS.CIRCUITS);
	const searchQuery = useSearchQuery(search);
	const isMap = view === CIRCUITS_VIEWS.MAP;
	const filters = { search: searchQuery, status, country };

	// Asked on the map too: the count and the countries of the filters come with the page
	const { data, error, isPlaceholderData } = useListPage(
		"circuits",
		{ page, ...filters },
		circuitSchema
	);
	const map = useCircuitsOnMap(filters, isMap);

	// Another search or filter makes another list: it starts from its first page
	function changeFilter(
		setFilter: (value: string) => void,
		value: string
	): void {
		setFilter(value);
		setPage(1);
	}

	function clearFilters(): void {
		[setSearch, setStatus, setCountry].forEach((setFilter) => setFilter(""));
		setPage(1);
	}

	const circuitsPageStyle = {
		container: {
			paddingY: 12,
			display: "grid",
			gridTemplateColumns: "minmax(0, 1fr)",
			gap: 6,
		},
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "end",
			gap: 4,
		},
		circuitListStyle: {
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

	// Until the list's page or the map's circuits arrive, whichever shows
	function renderPending(hasFailed: boolean): ReactNode {
		return hasFailed ? (
			<Error
				message="Failed to load circuits data"
				offlineMessage={
					searchQuery || status || country ? OFFLINE_MESSAGES.SEARCH : undefined
				}
			/>
		) : (
			<Loader />
		);
	}

	function renderCircuits(): ReactNode {
		if (isMap) {
			if (!map.data) return renderPending(Boolean(map.error));

			if (map.data.length === 0) {
				return <p>No circuits match the search and filters.</p>;
			}

			return (
				<Suspense fallback={<Loader />}>
					<CircuitsMap circuits={map.data} isBusy={map.isPlaceholderData} />
				</Suspense>
			);
		}

		if (!data) return renderPending(Boolean(error));

		if (data.data.length === 0) {
			return <p>No circuits match the search and filters.</p>;
		}

		return (
			<ul
				aria-busy={isPlaceholderData}
				className={css(circuitsPageStyle.circuitListStyle)}
			>
				{data.data.map((circuit) => (
					<CircuitCard key={circuit.id} circuit={circuit} />
				))}
			</ul>
		);
	}

	return (
		<section className={css(layoutGutters, circuitsPageStyle.container)}>
			<div className={css(circuitsPageStyle.header)}>
				<h1 className={css(cornerTitle)}>Circuits</h1>
				<IconSwitch
					label="View"
					options={VIEW_OPTIONS}
					value={isMap ? CIRCUITS_VIEWS.MAP : CIRCUITS_VIEWS.LIST}
					onChange={setView}
				/>
			</div>
			<FilterPanel
				search={{
					id: "circuits-search",
					label: "Search a circuit or a city",
					value: search,
					onChange: (value) => changeFilter(setSearch, value),
				}}
				total={data?.meta.total}
				itemName={{ one: "circuit", other: "circuits" }}
				isFiltered={Boolean(search || status || country)}
				onClear={clearFilters}
			>
				<SegmentedControl
					id="circuits-status"
					label="Status"
					options={STATUS_OPTIONS}
					value={status}
					onChange={(value) => changeFilter(setStatus, value)}
				/>
				<Select
					id="countries"
					label="Country"
					defaultOptionLabel="All"
					options={toSelectOptions(data?.meta.filters.country)}
					value={country}
					changeHandler={(event) =>
						changeFilter(setCountry, event.target.value)
					}
				/>
			</FilterPanel>
			{renderCircuits()}
			{data && !isMap && (
				<Pagination
					page={data.meta.page}
					pageCount={data.meta.pageCount}
					onPageChange={setPage}
				/>
			)}
		</section>
	);
};
