import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getDrivers } from "@/api/driver";
import type { TDriver } from "@/types/driver";

export const useDrivers = (): UseQueryResult<TDriver[], Error> =>
	useQuery({
		queryKey: ["getDrivers"],
		queryFn: getDrivers,
	});
