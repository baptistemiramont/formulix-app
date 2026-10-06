import type { z } from "zod";

import type { offlineCopySchema } from "@/types/schemas/offline";

export type TOfflineCopy = z.infer<typeof offlineCopySchema>;
