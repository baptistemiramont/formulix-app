import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getTeam } from "@/api/team";
import type { TTeamDetailed } from "@/types/team";

export const useTeam = (
	teamSlug: string
): UseQueryResult<TTeamDetailed, Error> =>
	useQuery({
		queryKey: ["getTeam", teamSlug],
		queryFn: () => getTeam(teamSlug),
		enabled: !!teamSlug,
	});
