import { type ChangeEvent, type FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { Error } from "@/components/Error";
import { Select } from "@/components/form/Select";
import { Loader } from "@/components/Loader";
import { Pagination } from "@/components/Pagination";
import { useData } from "@/hooks/useData";
import { useFilter } from "@/hooks/useFilter";
import { usePage } from "@/hooks/usePage";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { formatSeasons, getLayoutUrl, toFlagUrl } from "@/utils/circuit";
import { FILTER_STORAGE_KEYS, PAGE_STORAGE_KEYS } from "@/utils/constants";
import { paginate } from "@/utils/pagination";

const STATUS_OPTIONS = [
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
];

export const Circuits: FunctionComponent = () => {
	const { isCircuitsLoading, circuits, circuitsError } = useData();
	const [status, setStatus] = useFilter(FILTER_STORAGE_KEYS.CIRCUITS_STATUS);
	const [country, setCountry] = useFilter(
		FILTER_STORAGE_KEYS.CIRCUITS_COUNTRY
	);
	const [page, setPage] = usePage(PAGE_STORAGE_KEYS.CIRCUITS);

	// Another filter makes another list: it starts from its first page
	function filterByStatus(nextStatus: string): void {
		setStatus(nextStatus);
		setPage(1);
	}

	function filterByCountry(nextCountry: string): void {
		setCountry(nextCountry);
		setPage(1);
	}

	function handleStatusChange(event: ChangeEvent<HTMLSelectElement>): void {
		filterByStatus(event.target.value);
	}

	function handleCountryChange(event: ChangeEvent<HTMLSelectElement>): void {
		filterByCountry(event.target.value);
	}

	if (isCircuitsLoading) return <Loader />;

	if (circuitsError) {
		return <Error message="Failed to load circuits data" />;
	}

	const countryOptions = [
		...new Set(circuits.map((circuit) => circuit.country)),
	]
		.sort((a, b) => a.localeCompare(b))
		.map((countryName) => ({ label: countryName, value: countryName }));

	const filteredCircuits = circuits
		.filter(({ isActive }) => !status || isActive === (status === "active"))
		.filter((circuit) => !country || circuit.country === country);
	const {
		pageItems,
		page: currentPage,
		pageCount,
	} = paginate(filteredCircuits, page);

	const circuitsList = pageItems.map((circuit) => {
		const { id, name, slug, locality, country, countryCode } = circuit;
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
	});

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
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			},
		},
		formFieldsContainer: {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			gap: 6,
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			},
		},
	};

	return (
		<section className={css(layoutGutters, circuitsPageStyle.container)}>
			<h1 className={css(cornerTitle)}>Circuits</h1>
			{/* A form per filter: a reset button empties every field of its form */}
			<div className={css(circuitsPageStyle.formFieldsContainer)}>
				<form>
					<Select
						id="status"
						label="Filter by status"
						defaultOptionLabel="All"
						options={STATUS_OPTIONS}
						value={status}
						changeHandler={handleStatusChange}
						onReset={() => filterByStatus("")}
					/>
				</form>
				<form>
					<Select
						id="country"
						label="Filter by country"
						defaultOptionLabel="All"
						options={countryOptions}
						value={country}
						changeHandler={handleCountryChange}
						onReset={() => filterByCountry("")}
					/>
				</form>
			</div>
			{circuitsList.length === 0 ? (
				<p>No circuits match the selected filters.</p>
			) : (
				<ul className={css(circuitsPageStyle.circuitListStyle)}>
					{circuitsList}
				</ul>
			)}
			<Pagination
				page={currentPage}
				pageCount={pageCount}
				onPageChange={setPage}
			/>
		</section>
	);
};
