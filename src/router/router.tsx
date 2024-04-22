import {
	createRouter,
	createRoute,
	createRootRoute,
} from "@tanstack/react-router";
import { App } from "../App";
import { Home } from "../pages/Home";
import { Team } from "../pages/Team";
import { Driver } from "../pages/Driver";

const rootRoute = createRootRoute({
	component: () => <App />,
});

const routeTree = rootRoute.addChildren([
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => <Home />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/teams",
		component: () => <Team />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/drivers",
		component: () => <Driver />,
	}),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
