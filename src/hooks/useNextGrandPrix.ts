import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getNextGrandPrix } from "@/api/calendar";
import type { TNextGrandPrix } from "@/types/calendar";

export const useNextGrandPrix = (): UseQueryResult<
	TNextGrandPrix | null,
	Error
> =>
	useQuery({
		queryKey: ["getNextGrandPrix"],
		queryFn: getNextGrandPrix,
	});
