import { ReactNode, useEffect, useState } from "react";
import { useDrivers } from "@/hooks/useDrivers";
import { DataContext } from "@/contexts/DataContext";
import type { DriverType } from "@/types/driver";

export const DataProvider = ({ children }: { children: ReactNode }) => {
	const [filteredDrivers, setFilteredDrivers] = useState<DriverType[]>([]);
	const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const {
		data: driversData,
		isLoading: isDriversLoading,
		error: driversError,
	} = useDrivers();

	useEffect(() => {
		if (isDriversLoading) {
			setIsDataLoading(true);
		} else {
			setIsDataLoading(false);
		}

		if (driversError) setError(driversError);

		if (!isDriversLoading && driversData) {
			setFilteredDrivers(driversData);
		}
	}, [isDriversLoading, driversData, driversError]);

	function filterByTeam(teamSlug: string, drivers: DriverType[]): void {
		if (teamSlug === "") {
			setFilteredDrivers(drivers);
			return;
		}

		const filtered = drivers.filter((driver) => {
			const driverTeams = [driver.currentTeam];

			return driverTeams.some((team) => team.slug === teamSlug);
		});

		setFilteredDrivers(filtered);
	}

	return (
		<DataContext.Provider
			children={children}
			value={{
				filteredDrivers,
				isDataLoading,
				error,
				setFilteredDrivers,
				filterByTeam,
			}}
		/>
	);
};
