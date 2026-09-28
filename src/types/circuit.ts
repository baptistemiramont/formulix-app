import type { z } from "zod";

import type {
	circuitDetailedSchema,
	circuitSchema,
} from "@/types/schemas/circuit";

export type TCircuit = z.infer<typeof circuitSchema>;

export type TCircuitDetailed = z.infer<typeof circuitDetailedSchema>;

export type TCircuitLeaders = TCircuitDetailed["mostWins"];
