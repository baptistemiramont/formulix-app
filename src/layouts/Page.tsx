import { Outlet } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { AppToast } from "@/components/AppToast";
import { Footer } from "@/layouts/Footer";
import { Header } from "@/layouts/Header";

export const Page: FunctionComponent = () => {
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
			<Footer />
			<AppToast />
		</>
	);
};
