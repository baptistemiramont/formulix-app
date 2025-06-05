import { useQuery } from "@tanstack/react-query";

import { getTeams } from "@/api/team";
import type { TTeam } from "@/types/team";

export const useTeams = (): ReturnType<typeof useQuery> =>
	useQuery<TTeam[]>({
		queryKey: ["teams"],
		queryFn: getTeams,
	});
