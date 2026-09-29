import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";

import { App } from "@/App";
import { Circuit } from "@/pages/Circuit";
import { Circuits } from "@/pages/Circuits";
import { Driver } from "@/pages/Driver";
import { Drivers } from "@/pages/Drivers";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { Team } from "@/pages/Team";
import { Teams } from "@/pages/Teams";
import { ROUTES } from "@/utils/constants";

const rootRoute = createRootRoute({
	component: () => <App />,
});

const routeTree = rootRoute.addChildren([
	createRoute({
		getParentRoute: () => rootRoute,
		path: ROUTES.HOME,
		component: () => <Home />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: ROUTES.TEAMS,
		component: () => <Teams />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: ROUTES.TEAM,
		component: () => <Team />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: ROUTES.DRIVERS,
		component: () => <Drivers />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: ROUTES.DRIVER,
		component: () => <Driver />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: ROUTES.CIRCUITS,
		component: () => <Circuits />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: ROUTES.CIRCUIT,
		component: () => <Circuit />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "*",
		component: () => <NotFound />,
	}),
]);

export const router = createRouter({
	routeTree,
	scrollRestoration: true,
	// Overrides the smooth scroll of the page, the new page shows up already in place
	scrollRestorationBehavior: "instant",
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
