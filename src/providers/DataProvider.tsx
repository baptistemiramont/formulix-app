import { ReactNode, useEffect, useState } from "react";
import { useDrivers } from "@/hooks/useDrivers";
import { useTeams } from "@/hooks/useTeams";
import { DataContext } from "@/contexts/DataContext";
import type { DriverType } from "@/types/driver";
import type { TeamType } from "@/types/team";

export const DataProvider = ({ children }: { children: ReactNode }) => {
	const [drivers, setDrivers] = useState<DriverType[]>([]);
	const [filteredDrivers, setFilteredDrivers] = useState<DriverType[]>([]);
	const [teams, setTeams] = useState<TeamType[]>([]);

	function filterByTeam(teamSlug: string): void {
		if (!teamSlug || teamSlug === "") {
			setFilteredDrivers(drivers);
			return;
		}

		const filtered = drivers.filter(
			(driver) => driver.currentTeam.slug === teamSlug
		);

		setFilteredDrivers(filtered);
	}

	function resetFilteredDrivers(): void {
		setFilteredDrivers(drivers);
	}

	const {
		data: driversData,
		isLoading: isDriversLoading,
		error: driversError,
	} = useDrivers();

	const {
		data: teamsData,
		isLoading: isTeamsLoading,
		error: teamsError,
	} = useTeams();

	const isDataLoading = isDriversLoading || isTeamsLoading;
	const error = driversError || teamsError;

	useEffect(() => {
		if (driversData) {
			setDrivers(driversData);
			setFilteredDrivers(driversData);
		}
	}, [driversData]);

	useEffect(() => {
		if (teamsData) {
			setTeams(teamsData);
		}
	}, [teamsData]);

	return (
		<DataContext.Provider
			children={children}
			value={{
				filteredDrivers,
				resetFilteredDrivers,
				teams,
				isDataLoading,
				error,
				setFilteredDrivers,
				filterByTeam,
			}}
		/>
	);
};
