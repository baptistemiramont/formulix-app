export type DriverType = {
	id: number;
	firstName: string;
	lastName: string;
	avatar: string;
	country: string;
	worldChampionshipsTitle: number;
	podiums: number;
	grandPrixParticipation: number;
	currentTeam: {
		name: string;
		slug: string;
	};
	formerTeams: {
		name: string;
		slug: string;
	}[];
};

export type MinimalDriverType = {
	id: number;
	firstName: string;
	lastName: string;
	avatar: string;
	isActive: boolean;
};

export type DriverDetailedType = {
	id: number;
	firstName: string;
	lastName: string;
	avatar: string;
	country: string;
	worldChampionshipsTitle: number;
	podiums: number;
	grandPrixParticipation: number;
	teams: [
		{
			id: number;
			name: string;
			favicon: string;
			isCurrentTeam: boolean;
		},
	];
};
