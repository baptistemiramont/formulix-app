export type DriverType = {
	id: number;
	firstName: string;
	lastName: string;
	avatar: string;
	country: string;
	worldChampionshipsTitle: number;
	podiums: number;
	grandPrixParticipation: number;
	team: string;
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
