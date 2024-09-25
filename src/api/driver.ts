import type { DriverType } from "@/types/driver";
import { z } from "zod";

const driverSchema = z.object({
	id: z.number(),
	firstName: z.string(),
	lastName: z.string(),
	avatar: z.string(),
	country: z.string(),
	worldChampionshipsTitle: z.number(),
	podiums: z.number(),
	grandPrixParticipation: z.number(),
	team: z.string(),
});

export const getDrivers = async (): Promise<DriverType[]> => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/drivers`);

		const { data } = await response.json();

		const { success, data: drivers } = z.array(driverSchema).safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		return drivers;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};
