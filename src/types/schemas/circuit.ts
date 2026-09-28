import { z } from "zod";

const circuitDriverSchema = z.object({
	name: z.string(),
	slug: z.string().nullable(),
});

const circuitLeadersSchema = z
	.object({
		count: z.number(),
		drivers: z.array(circuitDriverSchema),
	})
	.nullable();

export const circuitSchema = z.object({
	id: z.number(),
	isActive: z.boolean(),
	name: z.string(),
	slug: z.string(),
	locality: z.string(),
	country: z.string(),
	countryCode: z.string().nullable(),
	grandsPrixCount: z.number(),
	firstSeason: z.number().nullable(),
	lastSeason: z.number().nullable(),
});

export const circuitDetailedSchema = circuitSchema.extend({
	grandPrixNames: z.array(z.string()),
	mostWins: circuitLeadersSchema,
	mostPoles: circuitLeadersSchema,
	grandsPrix: z.array(
		z.object({
			season: z.number(),
			round: z.number(),
			name: z.string(),
			pole: circuitDriverSchema.nullable(),
			winners: z.array(
				circuitDriverSchema.extend({
					team: z.object({
						name: z.string(),
						slug: z.string().nullable(),
					}),
				})
			),
		})
	),
});
