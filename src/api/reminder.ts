import { z } from "zod";

import { API_URL, QUERY_HEADERS } from "@/utils/constants";

const reminderKeySchema = z.object({
	publicKey: z.string(),
});

export async function getReminderKey(): Promise<string> {
	const options = {
		headers: QUERY_HEADERS,
	};

	const response = await fetch(`${API_URL}/reminders/key`, options);

	if (!response.ok) {
		throw new Error(`HTTP error ! status: ${response.status}`);
	}

	const { data } = await response.json();

	const { success, data: reminderKey } = reminderKeySchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return reminderKey.publicKey;
}

export async function saveSubscription(
	subscription: PushSubscription
): Promise<void> {
	const options = {
		method: "PUT",
		headers: { ...QUERY_HEADERS, "Content-Type": "application/json" },
		// The time zone the reminders reach the device in, sent again as it travels
		body: JSON.stringify({
			...subscription.toJSON(),
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		}),
	};

	const response = await fetch(`${API_URL}/reminders/subscription`, options);

	if (!response.ok) {
		throw new Error(`HTTP error ! status: ${response.status}`);
	}
}

export async function deleteSubscription(
	subscription: PushSubscription
): Promise<void> {
	const options = {
		method: "DELETE",
		headers: { ...QUERY_HEADERS, "Content-Type": "application/json" },
		body: JSON.stringify({ endpoint: subscription.endpoint }),
	};

	const response = await fetch(`${API_URL}/reminders/subscription`, options);

	if (!response.ok) {
		throw new Error(`HTTP error ! status: ${response.status}`);
	}
}
