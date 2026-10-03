import { createContext } from "react";

import type { TReminders } from "@/hooks/useReminders";

export const ReminderContext = createContext<TReminders | undefined>(
	undefined
);
