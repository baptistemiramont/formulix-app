import { useContext } from "react";

import { DataContext } from "@/contexts/DataContext";
import type { TDataState } from "@/providers/DataProvider";

export const useData = (): TDataState => {
	const context = useContext(DataContext);

	if (!context) {
		throw new Error("Context must be used within provider");
	}

	return context;
};
