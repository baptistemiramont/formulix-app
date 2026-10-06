/// <reference lib="webworker" />
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim, type WorkboxPlugin } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
	cleanupOutdatedCaches,
	createHandlerBoundToURL,
	precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";
import {
	CacheFirst,
	NetworkFirst,
	StaleWhileRevalidate,
} from "workbox-strategies";

import {
	API_URL,
	DEFAULT_IMAGE_PATHS,
	OFFLINE_CACHES,
} from "@/utils/constants";

declare const self: ServiceWorkerGlobalScope;

const API_ORIGIN = new URL(API_URL).origin;

// The flags Iconify serves, which the circuits show
const FLAGS_URL = "https://api.iconify.design/flag/";

// Slower than this, the API gives way to the answer kept
const API_TIMEOUT_S = 3;

// Every image the API serves, with room to spare: the least seen make way past it
const IMAGES_MAX_ENTRIES = 1000;

// Shows the Grand Prix reminders the API pushes
importScripts("reminders-sw.js");

// The app itself, its scripts, styles, fonts, images and circuit layouts: every page opens from index.html, connection or not
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html")));

// A new version waits until the visitor chooses to reload
self.addEventListener("message", (event) => {
	if (event.data?.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

clientsClaim();

// In CORS: an opaque answer would weigh megabytes in the storage quota
const corsRequest: WorkboxPlugin = {
	requestWillFetch: async ({ request }) =>
		new Request(request.url, { mode: "cors", credentials: "omit" }),
};

// Offline, an image not kept shows as the API's default one: the silhouette, or the default logo
const defaultImage: WorkboxPlugin = {
	handlerDidError: async ({ request }) => {
		const isLogo = new URL(request.url).pathname.startsWith(
			"/assets/images/teams/"
		);
		const path = isLogo ? DEFAULT_IMAGE_PATHS.TEAMS : DEFAULT_IMAGE_PATHS.DRIVERS;

		return caches.match(`${API_ORIGIN}${path}`, {
			cacheName: OFFLINE_CACHES.IMAGES,
			ignoreVary: true,
		});
	},
};

// The API's answers: the latest when it answers in time, the one kept otherwise, the Offline copy's to start with
// The copy itself is filed answer by answer, never kept whole
registerRoute(
	({ url }) =>
		url.href.startsWith(`${API_URL}/`) &&
		!url.href.startsWith(`${API_URL}/offline`),
	new NetworkFirst({
		cacheName: OFFLINE_CACHES.API,
		networkTimeoutSeconds: API_TIMEOUT_S,
		matchOptions: { ignoreVary: true },
		plugins: [new CacheableResponsePlugin({ statuses: [200] })],
	})
);

// The portraits and logos: shown at once from the device, then brought up to date, as one may change under the same name
registerRoute(
	({ url }) =>
		url.origin === API_ORIGIN && url.pathname.startsWith("/assets/images/"),
	new StaleWhileRevalidate({
		cacheName: OFFLINE_CACHES.IMAGES,
		matchOptions: { ignoreVary: true },
		plugins: [
			corsRequest,
			new CacheableResponsePlugin({ statuses: [200] }),
			new ExpirationPlugin({
				maxEntries: IMAGES_MAX_ENTRIES,
				purgeOnQuotaError: true,
			}),
			defaultImage,
		],
	})
);

// A country's flag never changes
registerRoute(
	({ url }) => url.href.startsWith(FLAGS_URL),
	new CacheFirst({
		cacheName: OFFLINE_CACHES.FLAGS,
		plugins: [corsRequest, new CacheableResponsePlugin({ statuses: [200] })],
	})
);
