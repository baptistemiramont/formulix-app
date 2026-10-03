import { useContext } from "react";

import { ReminderContext } from "@/contexts/ReminderContext";
import type { TReminders } from "@/hooks/useReminders";

export const useSharedReminders = (): TReminders => {
	const context = useContext(ReminderContext);

	if (!context) {
		throw new Error("Context must be used within provider");
	}

	return context;
};
