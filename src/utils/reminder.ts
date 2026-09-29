import { isAppleMobile } from "@/utils/haptics";

export const REMINDER_HINTS = {
	on: "Reminders on: three days before each Grand Prix, at 10 am.",
	install:
		"Add Formulix to your Home Screen to get a reminder before each Grand Prix.",
	blocked:
		"Notifications are blocked: allow them for Formulix in your settings.",
} as const;

// The API gives the VAPID key in base64url, the push manager takes its bytes
export function toApplicationServerKey(publicKey: string): Uint8Array {
	const base64 = publicKey
		.replace(/-/g, "+")
		.replace(/_/g, "/")
		.padEnd(Math.ceil(publicKey.length / 4) * 4, "=");

	return Uint8Array.from(atob(base64), (character) =>
		character.charCodeAt(0)
	);
}

export function canPush(): boolean {
	return (
		"serviceWorker" in navigator &&
		"PushManager" in window &&
		"Notification" in window
	);
}

// Safari on iPhone and iPad only pushes to the app added to the Home Screen
export function needsInstall(): boolean {
	return (
		isAppleMobile() &&
		!window.matchMedia("(display-mode: standalone)").matches
	);
}
