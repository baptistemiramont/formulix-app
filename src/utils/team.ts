import type { TTeam } from "@/types/team";

export function toTeamColor(color: string): string {
	return `#${color}`;
}

export function getTeamColor(
	teams: TTeam[],
	teamSlug?: string
): string | undefined {
	const team = teams.find(({ slug }) => slug === teamSlug);

	return team ? toTeamColor(team.color) : undefined;
}
