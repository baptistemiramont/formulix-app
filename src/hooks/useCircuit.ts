import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getCircuit } from "@/api/circuit";
import type { TCircuitDetailed } from "@/types/circuit";

export const useCircuit = (
	circuitSlug: string
): UseQueryResult<TCircuitDetailed, Error> =>
	useQuery({
		queryKey: ["getCircuit", circuitSlug],
		queryFn: () => getCircuit(circuitSlug),
		enabled: !!circuitSlug,
	});
