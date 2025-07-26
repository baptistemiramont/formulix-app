import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { getDriver } from "@/api/driver";
import type { TDriverDetailed } from "@/types/driver";

export const useDriver = (
	driverSlug: string
): UseQueryResult<TDriverDetailed, Error> =>
	useQuery({
		queryKey: ["getDriver", driverSlug],
		queryFn: () => getDriver(driverSlug),
		enabled: !!driverSlug,
	});
