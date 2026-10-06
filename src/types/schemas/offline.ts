import { z } from "zod";

export const offlineCopySchema = z.object({
	// The answers of the API, each by its path under API_URL, as its route gives it: read and checked when a page asks for it
	answers: z.record(z.unknown()),
	// The logos and the cutouts, kept from the start
	images: z.array(z.string()),
});
