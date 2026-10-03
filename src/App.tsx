import type { FunctionComponent } from "react";

import { Page } from "@/layouts/Page";
import { DataProvider } from "@/providers/DataProvider";
import { ReminderProvider } from "@/providers/ReminderProvider";

export const App: FunctionComponent = () => {
	return (
		<DataProvider>
			<ReminderProvider>
				<Page />
			</ReminderProvider>
		</DataProvider>
	);
};
