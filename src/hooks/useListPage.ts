import {
	keepPreviousData,
	useQuery,
	type UseQueryResult,
} from "@tanstack/react-query";
import type { z } from "zod";

import { getListPage, type TListResource } from "@/api/list";
import type { TListPage, TListQuery } from "@/types/list";

// The page shown stays until the next one arrives: no loader between two pages or two searches
export const useListPage = <T extends z.ZodTypeAny>(
	resource: TListResource,
	query: TListQuery,
	itemSchema: T
): UseQueryResult<TListPage<z.infer<T>>, Error> =>
	useQuery({
		queryKey: ["getListPage", resource, query],
		queryFn: () => getListPage(resource, query, itemSchema),
		placeholderData: keepPreviousData,
	});
