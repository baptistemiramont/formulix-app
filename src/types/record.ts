import type { z } from "zod";

import type { recordsSchema } from "@/types/schemas/record";

export type TRecords = z.infer<typeof recordsSchema>;
