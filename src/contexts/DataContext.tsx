import { createContext } from "react";
import type { DriverType } from "@/types/driver";
import { TeamType } from "@/types/team";

type DataContextType = {
	isDataLoading: boolean;
	error: Error | null;
	filteredDrivers: DriverType[];
	resetFilteredDrivers: () => void;
	teams: TeamType[];
	setFilteredDrivers: (drivers: DriverType[]) => void;
	filterByTeam: (teamSlug: string) => void;
};

export const DataContext = createContext<DataContextType | undefined>(
	undefined
);
