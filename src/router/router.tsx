import {
	createRouter,
	createRoute,
	createRootRoute,
} from "@tanstack/react-router";
import { App } from "../App";
import { Home } from "../pages/Home";

const rootRoute = createRootRoute({
	component: () => <App />,
});

const routeTree = rootRoute.addChildren([
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => <Home />,
	}),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
