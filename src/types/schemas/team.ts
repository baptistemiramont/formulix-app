import { z } from "zod";

export const teamSchema = z.object({
	id: z.number(),
	name: z.string(),
	fullName: z.string(),
	slug: z.string(),
	worldChampionships: z.number(),
	firstTeamEntry: z.number(),
	favicon: z.string(),
	color: z.string(),
});

export const teamDetailedSchema = z.object({
	id: z.number(),
	name: z.string(),
	fullName: z.string(),
	slug: z.string(),
	worldChampionships: z.number(),
	firstTeamEntry: z.number(),
	favicon: z.string(),
	color: z.string(),
	drivers: z.array(
		z.object({
			id: z.number(),
			firstName: z.string(),
			lastName: z.string(),
			slug: z.string(),
			avatar: z.string(),
			isActive: z.boolean(),
		})
	),
});
