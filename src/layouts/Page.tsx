import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Page = () => {
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
