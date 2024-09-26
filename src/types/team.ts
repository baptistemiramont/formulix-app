export type TeamType = {
	id: number;
	name: string;
	fullName: string;
	slug: string;
	worldChampionships: number;
	firstTeamEntry: number;
	favicon: string;
};

export type MinimalTeamType = {
	id: number;
	name: string;
	favicon: string;
	isCurrentTeam: boolean;
};
