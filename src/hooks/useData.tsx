import { useContext } from "react";
import { DataContext } from "@/contexts/DataContext";

export const useData = () => {
	const context = useContext(DataContext);

	if (!context) {
		throw new Error("Context must be used within provider");
	}

	return context;
};
