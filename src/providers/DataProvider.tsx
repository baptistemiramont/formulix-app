import { ReactNode, useState } from "react";
import { DataContext } from "@/contexts/DataContext";
import type { DriverType } from "@/types/driver";

export const DataProvider = ({ children }: { children: ReactNode }) => {
	const [filteredDrivers, setFilteredDrivers] = useState<DriverType[]>([]);

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
				setFilteredDrivers,
				filterByTeam,
			}}
		/>
	);
};
