import {
	keepPreviousData,
	useQuery,
	type UseQueryResult,
} from "@tanstack/react-query";

import { getCircuitsOnMap } from "@/api/circuit";
import type { TCircuitOnMap } from "@/types/circuit";
import type { TListQuery } from "@/types/list";

// Asked once the map shows; the circuits shown stay until the next search's arrive, as the list's page does
export const useCircuitsOnMap = (
	query: TListQuery,
	enabled: boolean
): UseQueryResult<TCircuitOnMap[], Error> =>
	useQuery({
		queryKey: ["getCircuitsOnMap", query],
		queryFn: () => getCircuitsOnMap(query),
		placeholderData: keepPreviousData,
		enabled,
	});
