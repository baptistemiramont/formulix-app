// As the reminders write them, in the device's time zone
const RACE_DAY_FORMAT = new Intl.DateTimeFormat("en-GB", {
	weekday: "long",
	day: "numeric",
	month: "long",
});
const RACE_TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
	hour: "2-digit",
	minute: "2-digit",
});
// A race day alone is a calendar day: read in UTC, it keeps its day whatever the visitor's time zone
const UTC_RACE_DAY_FORMAT = new Intl.DateTimeFormat("en-GB", {
	weekday: "long",
	day: "numeric",
	month: "long",
	timeZone: "UTC",
});

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function formatRaceStart(startsAt: Date): string {
	return `${RACE_DAY_FORMAT.format(startsAt)}, ${RACE_TIME_FORMAT.format(startsAt)}`;
}

export function formatRaceDay(raceDay: string): string {
	const [year, month, day] = raceDay.split("-").map(Number);

	return UTC_RACE_DAY_FORMAT.format(new Date(Date.UTC(year, month - 1, day)));
}

// The time left until the lights go out, as the countdown shows it
export function splitCountdown(remainingMs: number): {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
} {
	const remaining = Math.max(0, remainingMs);

	return {
		days: Math.floor(remaining / DAY_MS),
		hours: Math.floor((remaining % DAY_MS) / HOUR_MS),
		minutes: Math.floor((remaining % HOUR_MS) / MINUTE_MS),
		seconds: Math.floor((remaining % MINUTE_MS) / SECOND_MS),
	};
}
