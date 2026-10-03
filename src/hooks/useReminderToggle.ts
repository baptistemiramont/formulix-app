import { useEffect, useState } from "react";

import type { TReminders } from "@/hooks/useReminders";
import { REMINDER_HINTS } from "@/utils/reminder";
import { playRadioBeep, unlockSounds } from "@/utils/sounds";

const HINT_DURATION_MS = 5000;

// What a tap on a reminder button does, and the hint it leaves for a few seconds
export const useReminderToggle = ({
	state,
	toggle,
}: TReminders): {
	hint: string | null;
	isOn: boolean;
	isToggle: boolean;
	label: string;
	handleClick: () => Promise<void>;
} => {
	const [hint, setHint] = useState<string | null>(null);

	useEffect(() => {
		if (!hint) return;

		const timeout = setTimeout(() => setHint(null), HINT_DURATION_MS);

		return () => clearTimeout(timeout);
	}, [hint]);

	const isOn = state === "on";
	const isToggle = state === "on" || state === "off";
	const label = isOn
		? "Stop Grand Prix reminders"
		: "Remind me of each Grand Prix";

	async function handleClick(): Promise<void> {
		if (state === "install" || state === "blocked") {
			setHint(REMINDER_HINTS[state]);
			return;
		}

		// On the tap itself: subscribing takes a while, and Safari only starts audio from a gesture
		if (state === "off") {
			unlockSounds();
		}

		const nextState = await toggle();

		if (state === "off" && nextState === "on") {
			playRadioBeep();
		}

		setHint(
			nextState === "blocked" || nextState === "on"
				? REMINDER_HINTS[nextState]
				: null
		);
	}

	return { hint, isOn, isToggle, label, handleClick };
};
