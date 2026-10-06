import { z } from "zod";

import type { TOfflineCopy } from "@/types/offline";
import { toFlagUrl } from "@/utils/circuit";
import {
	API_URL,
	OFFLINE_CACHES,
	OFFLINE_COPY_MAX_AGE_MS,
	OFFLINE_COPY_STORAGE_KEY,
} from "@/utils/constants";

// Only the circuits' countries matter here, the pages check the rest when they read it
const circuitsPageSchema = z.object({
	data: z.array(z.object({ countryCode: z.string().nullable() })),
});

export function canKeepOffline(): boolean {
	return "serviceWorker" in navigator && "caches" in window;
}

// When the Offline copy was last saved, null before the first one
export function getOfflineCopyDate(): number | null {
	try {
		const savedAt = Number(localStorage.getItem(OFFLINE_COPY_STORAGE_KEY));

		return savedAt > 0 ? savedAt : null;
	} catch {
		return null;
	}
}

export function isOfflineCopyDue(): boolean {
	const savedAt = getOfflineCopyDate();

	return savedAt === null || Date.now() - savedAt > OFFLINE_COPY_MAX_AGE_MS;
}

// The flags of the circuits' countries, which the lists, the pages and the next Grand Prix show
function listFlags(answers: TOfflineCopy["answers"]): string[] {
	const countryCodes = Object.entries(answers)
		.filter(([path]) => path.startsWith("/circuits?"))
		.flatMap(([, answer]) => {
			const { success, data: page } = circuitsPageSchema.safeParse(answer);

			return success ? page.data.map(({ countryCode }) => countryCode) : [];
		})
		.filter((countryCode): countryCode is string => countryCode !== null);

	return [...new Set(countryCodes)].map(toFlagUrl);
}

// Each image once, one after the other rather than in a burst the servers would turn down
// One already kept stays: the service worker brings it up to date when it shows
async function keepImages(cacheName: string, urls: string[]): Promise<void> {
	const cache = await caches.open(cacheName);

	for (const url of urls) {
		if (await cache.match(url, { ignoreVary: true })) continue;

		try {
			// In CORS: an opaque answer would weigh megabytes in the storage quota
			await cache.add(new Request(url, { mode: "cors", credentials: "omit" }));
		} catch {
			// Out of reach for now: kept when it shows, or at the next copy
		}
	}
}

// Files each answer under the address the app asks for: the service worker answers from it as the API would
export async function saveOfflineCopy({
	answers,
	images,
}: TOfflineCopy): Promise<void> {
	const apiCache = await caches.open(OFFLINE_CACHES.API);

	await Promise.all(
		Object.entries(answers).map(([path, answer]) =>
			apiCache.put(
				`${API_URL}${path}`,
				new Response(JSON.stringify(answer), {
					headers: { "Content-Type": "application/json" },
				})
			)
		)
	);

	await Promise.all([
		keepImages(OFFLINE_CACHES.IMAGES, images),
		keepImages(OFFLINE_CACHES.FLAGS, listFlags(answers)),
	]);

	try {
		localStorage.setItem(OFFLINE_COPY_STORAGE_KEY, String(Date.now()));
	} catch {
		// Storage unavailable: the copy is saved again at the next opening.
	}
}

// What a failed request means without a connection: the Offline copy does not hold what the page asks for
export const OFFLINE_MESSAGES = {
	PAGE: "Not on this device yet: this page shows once you are back online.",
	SEARCH: "Searches and filters need a connection, unless made online before: this one shows once you are back online.",
} as const;
