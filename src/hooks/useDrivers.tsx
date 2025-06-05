import { useQuery } from "@tanstack/react-query";

import { getDrivers } from "@/api/driver";
import type { TDriver } from "@/types/driver";

export const useDrivers = (): ReturnType<typeof useQuery> => {
	return useQuery<TDriver[]>({
		queryKey: ["drivers"],
		queryFn: getDrivers,
	});
};
