import { z } from "zod";

import type { TListPage, TListQuery } from "@/types/list";
import { listMetaSchema } from "@/types/schemas/list";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export type TListResource = "drivers" | "teams" | "circuits";

export async function getListPage<T extends z.ZodTypeAny>(
	resource: TListResource,
	query: TListQuery,
	itemSchema: T
): Promise<TListPage<z.infer<T>>> {
	const options = { headers: QUERY_HEADERS };

	// A filter left empty stays out of the query: the API reads it as no filter
	const params = new URLSearchParams(
		Object.entries(query)
			.filter(([, value]) => value !== "")
			.map(([name, value]) => [name, String(value)])
	);

	const response = await fetch(`${API_URL}/${resource}?${params}`, options);

	if (!response.ok) {
		throw new Error(`Failed to fetch ${resource}`);
	}

	const { success, data: page } = z
		.object({ data: z.array(itemSchema), meta: listMetaSchema })
		.safeParse(await response.json());

	if (!success) {
		throw new Error("Invalid data format");
	}

	return page;
}
