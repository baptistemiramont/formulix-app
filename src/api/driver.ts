import type { DriverType } from "@/types/driver";
import { driverDetailedSchema, driverSchema } from "@/types/schemas/driver";
import { z } from "zod";

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

export const getDriver = async (id: number) => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/drivers/${id}`
		);

		const { data } = await response.json();

		const { success, data: team } = driverDetailedSchema.safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		return team;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};
