import { type FunctionComponent, type ReactNode } from "react";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { Error } from "@/components/Error";
import { FilterPanel } from "@/components/form/FilterPanel";
import { SegmentedControl } from "@/components/form/SegmentedControl";
import { Select } from "@/components/form/Select";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { useFilter } from "@/hooks/useFilter";
import { useListPage } from "@/hooks/useListPage";
import { usePage } from "@/hooks/usePage";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { circuitSchema } from "@/types/schemas/circuit";
import { formatSeasons, getLayoutUrl, toFlagUrl } from "@/utils/circuit";
import {
	FILTER_STORAGE_KEYS,
	PAGE_STORAGE_KEYS,
	STATUS_OPTIONS,
} from "@/utils/constants";
import { toSelectOptions } from "@/utils/list";
import { OFFLINE_MESSAGES } from "@/utils/offline";

export const Circuits: FunctionComponent = () => {
	const [search, setSearch] = useFilter(FILTER_STORAGE_KEYS.CIRCUITS_SEARCH);
	const [status, setStatus] = useFilter(FILTER_STORAGE_KEYS.CIRCUITS_STATUS);
	const [country, setCountry] = useFilter(
		FILTER_STORAGE_KEYS.CIRCUITS_COUNTRY
	);
	const [page, setPage] = usePage(PAGE_STORAGE_KEYS.CIRCUITS);
	const searchQuery = useSearchQuery(search);

	const { data, error, isPlaceholderData } = useListPage(
		"circuits",
		{ page, search: searchQuery, status, country },
		circuitSchema
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

	function renderCircuits(): ReactNode {
		if (!data) {
			return error ? (
				<Error
					message="Failed to load circuits data"
					offlineMessage={
						searchQuery || status || country
							? OFFLINE_MESSAGES.SEARCH
							: undefined
					}
				/>
			) : (
				<Loader />
			);
		}

		if (data.data.length === 0) {
			return <p>No circuits match the search and filters.</p>;
		}

		return (
			<ul
				aria-busy={isPlaceholderData}
				className={css(circuitsPageStyle.circuitListStyle)}
			>
				{data.data.map((circuit) => {
					const { id, name, slug, locality, country, countryCode } =
						circuit;
					const layoutUrl = getLayoutUrl(slug);
					const flag = {
						image: toFlagUrl(countryCode),
						alt: `${country}'s flag`,
					};

					return (
						<Card
							key={id}
							title={name}
							// Without a known layout, the flag takes the whole picture
							image={layoutUrl ?? flag.image}
							imageAlt={layoutUrl ? `${name}'s layout` : flag.alt}
							imageType={layoutUrl ? "layout" : "flag"}
							badge={layoutUrl ? flag : undefined}
							linkPath="/circuits/$circuitSlug"
							linkParams={{ circuitSlug: slug }}
							subtitle={`${locality} · ${formatSeasons(circuit)}`}
						/>
					);
				})}
			</ul>
		);
	}

	return (
		<section className={css(layoutGutters, circuitsPageStyle.container)}>
			<h1 className={css(cornerTitle)}>Circuits</h1>
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
