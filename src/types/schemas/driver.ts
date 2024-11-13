import { z } from "zod";

export const driverSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	avatar: z.string(),
	country: z.string(),
	worldChampionshipsTitle: z.number(),
	podiums: z.number(),
	grandPrixParticipation: z.number(),
	team: z.object({
		name: z.string(),
		slug: z.string(),
	}),
});

export const driverDetailedSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	avatar: z.string(),
	country: z.string(),
	worldChampionshipsTitle: z.number(),
	podiums: z.number(),
	grandPrixParticipation: z.number(),
	teams: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			favicon: z.string(),
			isCurrentTeam: z.boolean(),
		})
	),
});
