import { useContext } from "react";

import { DataContext } from "@/contexts/DataContext";
import type { TDataContext } from "@/providers/DataProvider";

export const useData = (): TDataContext => {
	const context = useContext(DataContext);

	if (!context) {
		throw new Error("Context must be used within provider");
	}

	return context;
};
