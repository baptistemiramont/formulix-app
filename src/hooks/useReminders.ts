import { useEffect, useRef, useState } from "react";

import {
	deleteSubscription,
	getReminderKey,
	saveSubscription,
} from "@/api/reminder";
import { canPush, needsInstall, toApplicationServerKey } from "@/utils/reminder";

// unavailable: no push here, the bell stays hidden; install: Safari on iPhone before the app is on the Home Screen
export type TReminderState = "unavailable" | "install" | "off" | "on" | "blocked";

export const useReminders = (): {
	state: TReminderState;
	isPending: boolean;
	toggle: () => Promise<TReminderState>;
} => {
	const [state, setState] = useState<TReminderState>("unavailable");
	const [isPending, setIsPending] = useState(false);
	const registration = useRef<ServiceWorkerRegistration | null>(null);
	const publicKey = useRef<string | null>(null);

	useEffect(() => {
		if (!canPush()) {
			setState(needsInstall() ? "install" : "unavailable");
			return;
		}

		let isMounted = true;

		(async () => {
			try {
				registration.current = await navigator.serviceWorker.ready;
				// Fetched ahead: Safari only subscribes right on the tap, without waiting for the network
				publicKey.current = await getReminderKey();

				const subscription =
					await registration.current.pushManager.getSubscription();

				if (subscription) {
					// Sent again at each opening: the reminders follow the device's time zone
					saveSubscription(subscription).catch(() => undefined);
				}

				if (!isMounted) return;

				if (Notification.permission === "denied") {
					setState("blocked");
				} else {
					setState(subscription ? "on" : "off");
				}
			} catch {
				// No service worker yet, or no reminders on the API: the bell stays hidden
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	async function subscribe(
		pushManager: PushManager,
		key: string
	): Promise<TReminderState> {
		const subscription = await pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: toApplicationServerKey(key),
		});

		await saveSubscription(subscription);

		return "on";
	}

	async function unsubscribe(pushManager: PushManager): Promise<TReminderState> {
		const subscription = await pushManager.getSubscription();

		if (subscription) {
			await subscription.unsubscribe();
			// Should it fail, the API forgets the subscription once the push service tells it is gone
			await deleteSubscription(subscription).catch(() => undefined);
		}

		return "off";
	}

	async function toggle(): Promise<TReminderState> {
		const pushManager = registration.current?.pushManager;
		const key = publicKey.current;

		if (!pushManager || !key || isPending) return state;

		setIsPending(true);

		let nextState: TReminderState;

		try {
			nextState =
				state === "on"
					? await unsubscribe(pushManager)
					: await subscribe(pushManager, key);
		} catch {
			// Refused in the prompt or in the settings, or the API is out of reach
			nextState = Notification.permission === "denied" ? "blocked" : "off";
		}

		setState(nextState);
		setIsPending(false);

		return nextState;
	}

	return { state, isPending, toggle };
};
