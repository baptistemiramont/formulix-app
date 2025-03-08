import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "@/api/driver";
import type { DriverType } from "@/types/driver";

export const useDrivers = () => {
	return useQuery<DriverType[]>({
		queryKey: ["drivers"],
		queryFn: getDrivers,
	});
};
