import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { Footer } from "@/layouts/Footer";
import { Header } from "@/layouts/Header";

export const Page: FunctionComponent = () => {
	return (
		<>
			<Header />
			<main>
				<ScrollRestoration />
				<Outlet />
			</main>
			<Footer />
		</>
	);
};
