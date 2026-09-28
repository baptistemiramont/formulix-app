import { z } from "zod";

export const teamSchema = z.object({
	id: z.number(),
	isActive: z.boolean(),
	name: z.string(),
	fullName: z.string(),
	slug: z.string(),
	logo: z.string(),
	color: z.string(),
	worldChampionships: z.number(),
	yearOfStart: z.number(),
	yearOfEnd: z.number().nullable(),
});

export const teamDetailedSchema = z.object({
	id: z.number(),
	isActive: z.boolean(),
	name: z.string(),
	fullName: z.string(),
	slug: z.string(),
	logo: z.string(),
	color: z.string(),
	worldChampionships: z.number(),
	yearOfStart: z.number(),
	yearOfEnd: z.number().nullable(),
	teamDetails: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			slug: z.string(),
			yearOfStart: z.number(),
			yearOfEnd: z.number().nullable(),
			logo: z.string(),
		})
	),
	drivers: z.array(
		z.object({
			id: z.number(),
			isCurrentDriver: z.boolean(),
			firstName: z.string(),
			lastName: z.string(),
			slug: z.string(),
			avatar: z.string(),
		})
	),
	standings: z.array(
		z.object({
			season: z.number(),
			// Null when unclassified: excluded, or without a point in the seasons that left such teams unranked
			position: z.number().nullable(),
			points: z.number(),
			wins: z.number(),
			isExcluded: z.boolean(),
			isFinal: z.boolean(),
			isTitle: z.boolean(),
		})
	),
});
