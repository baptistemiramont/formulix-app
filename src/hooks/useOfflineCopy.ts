import { useEffect, useState } from "react";

import { getOfflineCopy } from "@/api/offline";
import { useIsOnline } from "@/hooks/useIsOnline";
import { isStandalone } from "@/utils/install";
import {
	canKeepOffline,
	getOfflineCopyDate,
	isOfflineCopyDue,
	saveOfflineCopy,
} from "@/utils/offline";

// One copy at a time, however many times the effect runs
let saving: Promise<void> | null = null;

// Saves the Offline copy in the background, from the first opening and then once a day; true once the very first one is saved
export const useOfflineCopy = (): boolean => {
	const isOnline = useIsOnline();
	const [isFirstSaved, setIsFirstSaved] = useState(false);

	useEffect(() => {
		if (!isOnline || saving || !canKeepOffline() || !isOfflineCopyDue()) {
			return;
		}

		const isFirst = getOfflineCopyDate() === null;

		saving = (async () => {
			// Once the service worker is there to answer from it
			await navigator.serviceWorker.ready;
			await saveOfflineCopy(await getOfflineCopy());

			// Kept when space runs short; asked of a website rather than an installed app, Firefox would prompt for it
			if (isStandalone()) {
				await navigator.storage?.persist?.();
			}

			if (isFirst) {
				setIsFirstSaved(true);
			}
		})()
			// Out of reach or refused: tried again at the next opening or connection
			.catch(() => undefined)
			.finally(() => {
				saving = null;
			});
	}, [isOnline]);

	return isFirstSaved;
};
