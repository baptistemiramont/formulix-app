import {
	createRouter,
	createRoute,
	createRootRoute,
} from "@tanstack/react-router";
import { App } from "@/App";
import { Home } from "@/pages/Home";
import { Teams } from "@/pages/Teams";
import { Team } from "@/pages/Team";
import { Drivers } from "@/pages/Drivers";
import { Driver } from "@/pages/Driver";
import { NotFound } from "@/pages/NotFound";

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
		path: "/teams/$id",
		component: () => <Team />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/drivers",
		component: () => <Drivers />,
	}),
	createRoute({
		getParentRoute: () => rootRoute,
		path: "/drivers/$id",
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
