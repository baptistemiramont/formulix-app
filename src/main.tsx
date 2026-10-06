import React from "react";

import {
	onlineManager,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import { router } from "./router/router";

import "./index.css";

import "./utils/icons";

const rootElement = document.getElementById("app");

// Opened offline, the app knows it from the start: TanStack Query only learns it from the next change otherwise,
// asking again in vain meanwhile, and missing the connection back
onlineManager.setOnline(navigator.onLine);

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Offline too, the requests reach the service worker, which answers from the Offline copy
			networkMode: "always",
			// Without a connection, an answer the copy does not hold will not come by asking again
			retry: (failureCount) => onlineManager.isOnline() && failureCount < 3,
		},
	},
});

if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);

	root.render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</React.StrictMode>
	);
}
