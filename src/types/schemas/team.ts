import { z } from "zod";

import { avatarCreditSchema } from "@/types/schemas/photoCredit";
import { standingSchema } from "@/types/schemas/standing";

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
			avatarCredit: avatarCreditSchema,
			// Null once the driver no longer races in Formula 1; the team itself for its current drivers
			currentTeam: z
				.object({
					name: z.string(),
					slug: z.string(),
					color: z.string(),
				})
				.nullable(),
			// The seasons the driver raced for the team, under any of its names
			firstSeason: z.number().nullable(),
			lastSeason: z.number().nullable(),
		})
	),
	standings: z.array(standingSchema),
});
