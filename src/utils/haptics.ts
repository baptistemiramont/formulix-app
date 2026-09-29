const VIBRATION_MS = 10;

// Safari on iPhone and iPad has no Vibration API: only a switch toggled by a tap vibrates
export function isAppleMobile(): boolean {
	return (
		/iPhone|iPad|iPod/.test(navigator.userAgent) ||
		// iPadOS asks for the desktop site, as a Mac with a touch screen
		(/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)
	);
}

// A tick as short as the switch's on iPhone, wherever the Vibration API exists
export function vibrate(): void {
	navigator.vibrate?.(VIBRATION_MS);
}
