import type { z } from "zod";

import type { filterOptionSchema, listMetaSchema } from "./schemas/list";

export type TFilterOption = z.infer<typeof filterOptionSchema>;

export type TListMeta = z.infer<typeof listMetaSchema>;

export type TListPage<T> = {
	data: T[];
	meta: TListMeta;
};

// The page, the search and the filters asked for, by the name the API gives them
export type TListQuery = Record<string, string | number>;
