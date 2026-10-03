import type { z } from "zod";

import type { nextGrandPrixSchema } from "@/types/schemas/calendar";

export type TNextGrandPrix = z.infer<typeof nextGrandPrixSchema>;
