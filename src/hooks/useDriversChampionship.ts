import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getDriversChampionship } from "@/api/standing";
import type { TDriversChampionship } from "@/types/standing";

// The current season when none is given
export const useDriversChampionship = (
	season: number | null
): UseQueryResult<TDriversChampionship, Error> =>
	useQuery({
		queryKey: ["getDriversChampionship", season],
		queryFn: () => getDriversChampionship(season),
	});
