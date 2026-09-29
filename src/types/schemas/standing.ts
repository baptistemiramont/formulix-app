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
