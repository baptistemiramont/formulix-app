import { z } from "zod";

// The author and licence of a photo taken from Wikipedia, which the driver's page shows under it
export const photoCreditSchema = z.object({
	author: z.string().nullable(),
	license: z.string(),
	// None for a photo in the public domain
	licenseUrl: z.string().nullable(),
	// The photo's page, on Wikimedia Commons or Wikipedia
	source: z.string(),
});

// None for a cutout or the silhouette, nor from an API that does not send credits yet
export const avatarCreditSchema = photoCreditSchema.nullable().default(null);
