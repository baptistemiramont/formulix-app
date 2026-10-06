import { Outlet } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { AppToast } from "@/components/AppToast";
import { OfflineBanner } from "@/components/OfflineBanner";
import { useOfflineCopy } from "@/hooks/useOfflineCopy";
import { Footer } from "@/layouts/Footer";
import { Header } from "@/layouts/Header";

export const Page: FunctionComponent = () => {
	const isOfflineReady = useOfflineCopy();

	return (
		<>
			<Header />
			<OfflineBanner />
			<main>
				<Outlet />
			</main>
			<Footer />
			<AppToast isOfflineReady={isOfflineReady} />
		</>
	);
};
