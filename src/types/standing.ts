import type { z } from "zod";

import type { standingSchema } from "@/types/schemas/standing";

export type TStanding = z.infer<typeof standingSchema>;

// A stretch of seasons under one name, drawn behind the standings: a team's name, or the team a driver raced for
export type TStandingsBand = {
	name: string;
	yearOfStart: number;
	yearOfEnd: number | null;
};
