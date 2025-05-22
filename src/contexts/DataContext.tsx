import { createContext } from "react";

import type { TDriverType } from "@/types/driver";
import type { TTeam } from "@/types/team";

type DataContextType = {
	isDataLoading: boolean;
	error: Error | null;
	filteredDrivers: TDriverType[];
	resetFilteredDrivers: () => void;
	teams: TTeam[];
	setFilteredDrivers: (drivers: TDriverType[]) => void;
	filterByTeam: (teamSlug: string) => void;
};

export const DataContext = createContext<DataContextType | undefined>(
	undefined
);
