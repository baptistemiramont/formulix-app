import { DriverType } from "./driver";

export type TeamType = {
	id: number;
	name: string;
	fullName: string;
	slug: string;
	worldChampionships: number;
	firstTeamEntry: number;
	favicon: string;
	Drivers: DriverType[];
};