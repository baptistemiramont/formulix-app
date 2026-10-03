import { z } from "zod";

export const standingSchema = z.object({
	season: z.number(),
	// Null when unclassified: excluded, or without a point in the seasons that left such teams or drivers unranked
	position: z.number().nullable(),
	points: z.number(),
	wins: z.number(),
	isExcluded: z.boolean(),
	isFinal: z.boolean(),
	isTitle: z.boolean(),
});

// A season's standing, whose season and finality the championship gives once for all
const championshipStandingSchema = standingSchema.omit({
	season: true,
	isFinal: true,
});

const championshipSchema = z.object({
	season: z.number(),
	isFinal: z.boolean(),
	// Every season with standings, the latest first
	seasons: z.array(z.number()),
});

export const driversChampionshipSchema = championshipSchema.extend({
	standings: z.array(
		championshipStandingSchema.extend({
			driver: z.object({
				firstName: z.string(),
				lastName: z.string(),
				slug: z.string(),
				avatar: z.string(),
			}),
			// The team the driver ended the season with, under its name of that season
			team: z.object({
				name: z.string(),
				// Null when Formulix does not follow the team
				slug: z.string().nullable(),
				// Null under a former name, whose colour Formulix does not know
				color: z.string().nullable(),
			}),
		})
	),
});

export const constructorsChampionshipSchema = championshipSchema.extend({
	standings: z.array(
		championshipStandingSchema.extend({
			// Under its name and logo of that season
			team: z.object({
				name: z.string(),
				slug: z.string(),
				logo: z.string(),
				// Null under a former name, whose colour Formulix does not know
				color: z.string().nullable(),
			}),
		})
	),
});
