import { type ReactNode, useEffect, useState } from "react";

import { DataContext } from "@/contexts/DataContext";
import { useDrivers } from "@/hooks/useDrivers";
import { useTeams } from "@/hooks/useTeams";
import type { TDriver } from "@/types/driver";
import type { TTeam } from "@/types/team";

export type TDataContext = {
	isDataLoading: boolean;
	error: Error | null;
	filteredDrivers: TDriver[];
	resetFilteredDrivers: () => void;
	teams: TTeam[];
	setFilteredDrivers: (drivers: TDriver[]) => void;
	filterByTeam: (teamSlug: string) => void;
};

type TDataProviderProps = {
	children: ReactNode;
};

export const DataProvider = ({ children }: TDataProviderProps): ReactNode => {
	const [drivers, setDrivers] = useState<TDriver[]>([]);
	const [filteredDrivers, setFilteredDrivers] = useState<TDriver[]>([]);
	const [teams, setTeams] = useState<TTeam[]>([]);

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
