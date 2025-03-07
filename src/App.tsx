import { DataProvider } from "@/providers/DataProvider";
import { Page } from "@/layouts/Page";

export const App = () => {
	return (
		<DataProvider>
			<Page />
		</DataProvider>
	);
};
