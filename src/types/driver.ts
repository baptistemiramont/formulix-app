import type { z } from "zod";

import type { driverDetailedSchema, driverSchema } from "./schemas/driver";

export type TDriver = z.infer<typeof driverSchema>;

export type MinimalDriverType = {
	id: number;
	firstName: string;
	lastName: string;
	slug: string;
	avatar: string;
	isActive: boolean;
};

export type TDriverDetailed = z.infer<typeof driverDetailedSchema>;
