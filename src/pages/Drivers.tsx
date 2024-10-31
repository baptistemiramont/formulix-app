import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "@/api/driver";
import { DriverCard } from "@/components/cards/DriverCard";
import type { DriverType } from "@/types/driver";
import { css } from "../../styled-system/css";
import { Loader } from "@/components/Loader";
import { layoutGutters } from "@/styles/layout";

export const Drivers = () => {
	const {
		data: drivers,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["drivers"],
		queryFn: getDrivers,
	});

	if (isLoading) return <Loader />;

	if (error) return "An error has occurred: " + error.message;

	if (!drivers) return "No drivers found";

	const driversList = drivers.map((driver: DriverType) => (
		<DriverCard key={driver.id} driver={driver} />
	));

	// Styles

	const driversPageStyle = {
		container: {
			paddingY: 12,
			display: "grid",
			gap: 6,
		},
		teamListStyle: {
			display: "grid",
			gap: 6,
			gridTemplateColumns: "repeat(2, 1fr)",
			lg: {
				gridTemplateColumns: "repeat(3, 1fr)",
			},
			"2xl": {
				gridTemplateColumns: "repeat(4, 1fr)",
			},
		},
	};

	return (
		<section className={css(layoutGutters, driversPageStyle.container)}>
			<h1>Drivers</h1>
			<ul className={css(driversPageStyle.teamListStyle)}>{driversList}</ul>
		</section>
	);
};
