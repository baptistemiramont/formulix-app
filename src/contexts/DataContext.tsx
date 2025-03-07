import { createContext } from "react";
import type { DriverType } from "@/types/driver";

type DataContextType = {
	filteredDrivers: DriverType[];
	setFilteredDrivers: (drivers: DriverType[]) => void;
	filterByTeam: (teamSlug: string, drivers: DriverType[]) => void;
};

export const DataContext = createContext<DataContextType | undefined>(
	undefined
);
