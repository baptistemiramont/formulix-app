export type TeamType = {
	id: number;
	name: string;
	fullName: string;
	slug: string;
	worldChampionships: number;
	firstTeamEntry: number;
	favicon: string;
	color: string;
};

export type MinimalTeamType = {
	id: number;
	name: string;
	favicon: string;
	isCurrentTeam: boolean;
};

export type TeamDetailedType = {
	id: number;
	name: string;
	fullName: string;
	slug: string;
	worldChampionships: number;
	firstTeamEntry: number;
	favicon: string;
	color: string;
	drivers: {
		id: number;
		firstName: string;
		lastName: string;
		avatar: string;
		isActive: boolean;
	}[];
};
