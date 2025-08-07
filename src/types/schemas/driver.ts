import { z } from "zod";

export const driverSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	slug: z.string(),
	avatar: z.string(),
	country: z.string(),
	worldChampionshipsTitle: z.number(),
	podiums: z.number(),
	grandPrixParticipation: z.number(),
	currentTeam: z
		.object({
			name: z.string(),
			slug: z.string(),
		})
		.nullable(),
});

export const driverDetailedSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	slug: z.string(),
	avatar: z.string(),
	country: z.string(),
	worldChampionshipsTitle: z.number(),
	podiums: z.number(),
	grandPrixParticipation: z.number(),
	teams: z.array(
		z.object({
			id: z.number(),
			isCurrentTeam: z.boolean(),
			name: z.string(),
			slug: z.string(),
			originalTeamSlug: z.string(),
			logo: z.string(),
		})
	),
});
