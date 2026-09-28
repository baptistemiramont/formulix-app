import type { TCircuit, TCircuitLeaders } from "@/types/circuit";

// The flag icons Iconify serves, the same source as the app's other icons
const FLAG_URL = "https://api.iconify.design/flag";

export function toFlagUrl(countryCode: string | null): string {
	return countryCode
		? `${FLAG_URL}/${countryCode}-4x3.svg`
		: "/assets/images/default-team.png";
}

export function formatSeasons({
	isActive,
	firstSeason,
	lastSeason,
}: Pick<TCircuit, "isActive" | "firstSeason" | "lastSeason">): string {
	if (firstSeason === null) return "Not raced yet";

	if (isActive) return `${firstSeason} - Present`;

	return firstSeason === lastSeason
		? `${firstSeason}`
		: `${firstSeason} - ${lastSeason}`;
}

export function formatLeaders(leaders: TCircuitLeaders): string {
	if (!leaders) return "-";

	const names = leaders.drivers.map(({ name }) => name).join(", ");

	return `${names} (${leaders.count})`;
}

// The layouts drawn by scripts/build-circuit-layouts.js, kept out of the bundle and loaded when shown
const LAYOUT_URLS: Record<string, string> = Object.fromEntries(
	Object.entries(
		import.meta.glob<string>("/src/assets/circuits/*.svg", {
			eager: true,
			query: "?no-inline",
			import: "default",
		})
	).map(([path, url]) => [path.replace(/^.*\/|\.svg$/g, ""), url])
);

export function getLayoutUrl(circuitSlug: string): string | undefined {
	return LAYOUT_URLS[circuitSlug];
}
