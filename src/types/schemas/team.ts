import { z } from "zod";

export const teamSchema = z.object({
	id: z.number(),
	name: z.string(),
	fullName: z.string(),
	slug: z.string(),
	worldChampionships: z.number(),
	firstTeamEntry: z.number(),
	favicon: z.string(),
});
