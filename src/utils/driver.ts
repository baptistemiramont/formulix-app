const BIRTH_DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "long",
	year: "numeric",
	// The date of birth is a calendar day: read in UTC, it keeps its day whatever the visitor's time zone
	timeZone: "UTC",
});

export function formatBirth(dateOfBirth: string, today = new Date()): string {
	const [year, month, day] = dateOfBirth.split("-").map(Number);
	const hasHadBirthday =
		today.getMonth() + 1 > month ||
		(today.getMonth() + 1 === month && today.getDate() >= day);
	const age = today.getFullYear() - year - (hasHadBirthday ? 0 : 1);
	const date = BIRTH_DATE_FORMAT.format(
		new Date(Date.UTC(year, month - 1, day))
	);

	return `Born ${date} (${age})`;
}
