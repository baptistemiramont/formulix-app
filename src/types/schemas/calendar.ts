import { z } from "zod";

export const nextGrandPrixSchema = z.object({
	season: z.number(),
	round: z.number(),
	// The rounds on the season's calendar
	roundCount: z.number(),
	name: z.string(),
	// The race day, in UTC
	raceDay: z.string(),
	// Null until the race start is known: the race day alone is shown
	startsAt: z.string().nullable(),
	circuit: z.object({
		slug: z.string(),
		name: z.string(),
		locality: z.string(),
		country: z.string(),
		countryCode: z.string().nullable(),
	}),
});
