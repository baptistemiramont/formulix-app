import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getCircuits } from "@/api/circuit";
import type { TCircuit } from "@/types/circuit";

export const useCircuits = (): UseQueryResult<TCircuit[], Error> =>
	useQuery({
		queryKey: ["getCircuits"],
		queryFn: getCircuits,
	});
