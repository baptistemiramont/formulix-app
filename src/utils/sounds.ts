// Two short tones, as a team radio message opens on the broadcasts
const RADIO_BEEP = {
	FREQUENCY_HZ: 1100,
	// Narrows the tones to the band of a radio
	BAND_HZ: 1800,
	TONE_S: 0.09,
	GAP_S: 0.07,
	VOLUME: 0.08,
};

type TAudioSessionNavigator = Navigator & { audioSession?: { type: string } };

let context: AudioContext | null = null;

// Called on the tap itself: Safari only starts audio from a gesture, and lets it play afterwards
export function unlockSounds(): void {
	if (!context) {
		const { audioSession } = navigator as TAudioSessionNavigator;

		// Safari: muted by the silent switch, and mixed with the music playing rather than stopping it
		if (audioSession) {
			audioSession.type = "ambient";
		}

		context = new AudioContext();
	}

	context.resume().catch(() => undefined);
}

export function playRadioBeep(): void {
	if (context?.state !== "running") return;

	const start = context.currentTime;
	const band = context.createBiquadFilter();

	band.type = "bandpass";
	band.frequency.value = RADIO_BEEP.BAND_HZ;
	band.connect(context.destination);

	for (const toneStart of [start, start + RADIO_BEEP.TONE_S + RADIO_BEEP.GAP_S]) {
		const tone = context.createOscillator();
		const volume = context.createGain();
		const toneEnd = toneStart + RADIO_BEEP.TONE_S;

		tone.type = "square";
		tone.frequency.value = RADIO_BEEP.FREQUENCY_HZ;
		// A few milliseconds of fade on each side: a tone cut dead clicks
		volume.gain.setValueAtTime(0, toneStart);
		volume.gain.linearRampToValueAtTime(RADIO_BEEP.VOLUME, toneStart + 0.005);
		volume.gain.setValueAtTime(RADIO_BEEP.VOLUME, toneEnd - 0.005);
		volume.gain.linearRampToValueAtTime(0, toneEnd);
		tone.connect(volume).connect(band);
		tone.start(toneStart);
		tone.stop(toneEnd);
	}
}
