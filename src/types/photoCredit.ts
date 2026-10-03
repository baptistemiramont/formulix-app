import type { z } from "zod";

import type { photoCreditSchema } from "./schemas/photoCredit";

export type TPhotoCredit = z.infer<typeof photoCreditSchema>;
