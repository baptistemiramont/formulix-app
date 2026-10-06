import { isAppleMobile } from "@/utils/haptics";

// The event Chrome and Edge fire when the app can be installed, which TypeScript does not know yet
type TBeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
};

// prompt: the browser installs it on a tap; ios: Safari adds it from its Share menu; unavailable: installed already, or not installable here
export type TInstallState = "prompt" | "ios" | "unavailable";

let installPrompt: TBeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notify(): void {
	listeners.forEach((listener) => listener());
}

// Listened from the start: the browser offers the install as the page loads, before React renders
window.addEventListener("beforeinstallprompt", (event) => {
	// The app offers it in its header, instead of the browser's own banner
	event.preventDefault();
	installPrompt = event as TBeforeInstallPromptEvent;
	notify();
});

window.addEventListener("appinstalled", () => {
	installPrompt = null;
	notify();
});

export function isStandalone(): boolean {
	return window.matchMedia("(display-mode: standalone)").matches;
}

export function subscribeToInstall(listener: () => void): () => void {
	listeners.add(listener);

	return () => listeners.delete(listener);
}

export function getInstallState(): TInstallState {
	if (isStandalone()) return "unavailable";

	if (installPrompt) return "prompt";

	return isAppleMobile() ? "ios" : "unavailable";
}

// Shows the browser's install prompt: once only, the browser offers it again later should it be dismissed
export async function promptInstall(): Promise<void> {
	const prompt = installPrompt;

	if (!prompt) return;

	installPrompt = null;
	notify();

	await prompt.prompt();
}
