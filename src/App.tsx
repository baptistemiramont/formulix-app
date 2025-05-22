import type { FunctionComponent } from "react";

import { Page } from "@/layouts/Page";
import { DataProvider } from "@/providers/DataProvider";

export const App: FunctionComponent = () => {
	return (
		<DataProvider>
			<Page />
		</DataProvider>
	);
};
