import type { z } from "zod";

import type { driverDetailedSchema, driverSchema } from "./schemas/driver";

export type TDriverType = z.infer<typeof driverSchema>;

export type MinimalDriverType = {
	id: number;
	firstName: string;
	lastName: string;
	avatar: string;
	isActive: boolean;
};

export type TDriverDetailedType = z.infer<typeof driverDetailedSchema>;
