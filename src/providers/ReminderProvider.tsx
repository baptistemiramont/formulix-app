import type { PropsWithChildren, ReactNode } from "react";

import { ReminderContext } from "@/contexts/ReminderContext";
import { useReminders } from "@/hooks/useReminders";

// Above the page: the header's bells and the next Grand Prix card show the same reminders, and switch them together
export const ReminderProvider = ({ children }: PropsWithChildren): ReactNode => (
	<ReminderContext.Provider value={useReminders()}>
		{children}
	</ReminderContext.Provider>
);
