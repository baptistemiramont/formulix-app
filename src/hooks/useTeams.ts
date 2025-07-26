import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getTeams } from "@/api/team";
import type { TTeam } from "@/types/team";

export const useTeams = (): UseQueryResult<TTeam[], Error> =>
	useQuery({
		queryKey: ["getTeams"],
		queryFn: getTeams,
	});
