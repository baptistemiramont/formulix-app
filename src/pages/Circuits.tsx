import { type ChangeEvent, type FunctionComponent, useState } from "react";

import { css } from "@/../styled-system/css";
import { Card } from "@/components/cards/Card";
import { Error } from "@/components/Error";
import { Select } from "@/components/form/Select";
import { Loader } from "@/components/Loader";
import { useData } from "@/hooks/useData";
import { layoutGutters } from "@/styles/layout";
import { cornerTitle } from "@/styles/title";
import { formatSeasons, getLayoutUrl, toFlagUrl } from "@/utils/circuit";

const STATUS_OPTIONS = [
	{ label: "Active", value: "active" },
	{ label: "Inactive", value: "inactive" },
];

export const Circuits: FunctionComponent = () => {
	const { isCircuitsLoading, circuits, circuitsError } = useData();
	const [status, setStatus] = useState("");
	const [country, setCountry] = useState("");

	function handleStatusChange(event: ChangeEvent<HTMLSelectElement>): void {
		setStatus(event.target.value);
	}

	function handleCountryChange(event: ChangeEvent<HTMLSelectElement>): void {
		setCountry(event.target.value);
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

	const circuitsList = circuits
		.filter(({ isActive }) => !status || isActive === (status === "active"))
		.filter((circuit) => !country || circuit.country === country)
		.map((circuit) => {
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
						changeHandler={handleStatusChange}
						onReset={() => setStatus("")}
					/>
				</form>
				<form>
					<Select
						id="country"
						label="Filter by country"
						defaultOptionLabel="All"
						options={countryOptions}
						changeHandler={handleCountryChange}
						onReset={() => setCountry("")}
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
		</section>
	);
};
