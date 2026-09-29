// Grand Prix reminders, imported into the service worker vite-plugin-pwa generates
// The API pushes the race start in UTC: the device writes it in its own time zone, wherever it is

const DAY_FORMAT = new Intl.DateTimeFormat("en-GB", {
	weekday: "long",
	day: "numeric",
	month: "long",
});
const TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
	hour: "2-digit",
	minute: "2-digit",
});

/**
 * Writes the notification of a reminder
 * @param {PushMessageData|null} data - The pushed data: { grandPrix, startsAt, circuitSlug }
 * @returns {{ title: string, options: NotificationOptions }} The notification
 */
function writeReminder(data) {
	const options = { icon: "/pwa-192x192.png" };

	try {
		const { grandPrix, startsAt, circuitSlug } = data.json();
		const start = new Date(startsAt);

		return {
			title: grandPrix,
			options: {
				...options,
				body: `Lights out on ${DAY_FORMAT.format(start)} at ${TIME_FORMAT.format(start)}`,
				tag: `reminder-${circuitSlug}`,
				data: { url: `/circuits/${circuitSlug}` },
			},
		};
	} catch {
		// Safari revokes the subscription of an app that receives a push without showing it
		return { title: "Formulix", options: { ...options, body: "A Grand Prix is coming up", data: { url: "/" } } };
	}
}

self.addEventListener("push", (event) => {
	const { title, options } = writeReminder(event.data);

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	const url = new URL(event.notification.data?.url ?? "/", self.location.origin).href;

	event.waitUntil((async () => {
		const [client] = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

		if (!client) {
			return self.clients.openWindow(url);
		}

		const focusedClient = await client.focus();

		return focusedClient.navigate(url);
	})());
});
