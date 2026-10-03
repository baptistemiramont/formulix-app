import { z } from "zod";

export const filterOptionSchema = z.object({
	value: z.string(),
	// Null for the drivers without a current team, which the app names
	label: z.string().nullable(),
	count: z.number(),
});

export const listMetaSchema = z.object({
	total: z.number(),
	page: z.number(),
	pageCount: z.number(),
	pageSize: z.number(),
	filters: z.record(z.array(filterOptionSchema)),
});
