import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getConstructorsChampionship } from "@/api/standing";
import type { TConstructorsChampionship } from "@/types/standing";
import { FIRST_CHAMPIONSHIP_SEASON } from "@/utils/standings";

// The current season when none is given
export const useConstructorsChampionship = (
	season: number | null
): UseQueryResult<TConstructorsChampionship, Error> =>
	useQuery({
		queryKey: ["getConstructorsChampionship", season],
		queryFn: () => getConstructorsChampionship(season),
		// No constructors' championship to ask for before it started
		enabled: season === null || season >= FIRST_CHAMPIONSHIP_SEASON,
	});
