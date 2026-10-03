import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getRecords } from "@/api/record";
import type { TRecords } from "@/types/record";

export const useRecords = (): UseQueryResult<TRecords, Error> =>
	useQuery({
		queryKey: ["getRecords"],
		queryFn: getRecords,
	});
