import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/api/team";
import type { TeamType } from "@/types/team";

export const useTeams = () =>
	useQuery<TeamType[]>({
		queryKey: ["teams"],
		queryFn: getTeams,
	});
