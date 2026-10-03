import type { z } from "zod";

import type {
	constructorsChampionshipSchema,
	driversChampionshipSchema,
	standingSchema,
} from "@/types/schemas/standing";

export type TStanding = z.infer<typeof standingSchema>;

export type TChampionship = "constructors" | "drivers";

// A season's drivers' or constructors' championship, with every standing of it
export type TDriversChampionship = z.infer<typeof driversChampionshipSchema>;

export type TConstructorsChampionship = z.infer<
	typeof constructorsChampionshipSchema
>;

// A stretch of seasons under one name, drawn behind the standings: a team's name, or the team a driver raced for
export type TStandingsBand = {
	name: string;
	yearOfStart: number;
	yearOfEnd: number | null;
};
