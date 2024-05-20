import { TeamType } from "./team";

export type DriverType = {
	id: number;
	firstName: string;
	lastName: string;
	country: string;
	worldChampionshipsTitle: number;
	podiums: number;
	grandPrixParticipation: number;
	Teams: TeamType[];
};
