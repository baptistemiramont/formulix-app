import { z } from "zod";

import { avatarCreditSchema } from "@/types/schemas/photoCredit";

// Every driver, team or circuit tied on the best mark; null while nobody holds it
const recordSchema = <T extends z.ZodTypeAny>(
	holderSchema: T
): z.ZodNullable<
	z.ZodObject<{ count: z.ZodNumber; holders: z.ZodArray<T> }>
> =>
	z
		.object({
			count: z.number(),
			holders: z.array(holderSchema),
		})
		.nullable();

const driverHolderSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	slug: z.string(),
	avatar: z.string(),
	avatarCredit: avatarCreditSchema,
});

export const recordsSchema = z.object({
	totals: z.object({
		drivers: z.number(),
		// The drivers who raced the latest Grand Prix
		gridDrivers: z.number(),
		teams: z.number(),
		activeTeams: z.number(),
		circuits: z.number(),
		activeCircuits: z.number(),
		grandsPrix: z.number(),
		seasons: z.number(),
	}),
	records: z.object({
		worldTitles: recordSchema(driverHolderSchema),
		grandPrixWins: recordSchema(driverHolderSchema),
		podiums: recordSchema(driverHolderSchema),
		grandPrixStarts: recordSchema(driverHolderSchema),
		constructorsTitles: recordSchema(
			z.object({
				name: z.string(),
				slug: z.string(),
				logo: z.string(),
				color: z.string(),
			})
		),
		grandsPrixHosted: recordSchema(
			z.object({
				name: z.string(),
				slug: z.string(),
				locality: z.string(),
				country: z.string(),
				countryCode: z.string().nullable(),
			})
		),
	}),
});
