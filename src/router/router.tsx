import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";

import { App } from "@/App";
import { Driver } from "@/pages/Driver";
import { Drivers } from "@/pages/Drivers";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Team } from "@/pages/Team";
import { Teams } from "@/pages/Teams";

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
		component: () => <Teams />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/teams/$teamSlug",
		component: () => <Team />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/drivers",
		component: () => <Drivers />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/drivers/$driverSlug",
		component: () => <Driver />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "*",
		component: () => <NotFound />,
	}),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
