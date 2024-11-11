import type { DriverType } from "@/types/driver";
import { driverDetailedSchema, driverSchema } from "@/types/schemas/driver";
import { z } from "zod";

const apiKey: string = import.meta.env.VITE_API_KEY;

export const getDrivers = async (): Promise<DriverType[]> => {
	try {
		const options = {
			headers: {
				APIKey: apiKey,
			},
		};

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/drivers`,
			options
		);

		const { data } = await response.json();

		const { success, data: drivers } = z.array(driverSchema).safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		return drivers.map((driver) => {
			return {
				...driver,
				avatar: `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${driver.avatar}`,
			};
		});
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
		const options = {
			headers: {
				APIKey: apiKey,
			},
		};

		const response = await fetch(
			`${import.meta.env.VITE_API_URL}/drivers/${id}`,
			options
		);

		const { data } = await response.json();

		const { success, data: driver } = driverDetailedSchema.safeParse(data);

		if (!success) {
			throw new Error("Invalid data format");
		}

		driver.avatar = `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${driver.avatar}`;

		driver.teams = driver.teams.map((team) => {
			return {
				...team,
				favicon: `${import.meta.env.VITE_API_URL.replace("/api/v1", "")}${team.favicon}`,
			};
		});

		return driver;
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error("An unknown error occurred");
		}
	}
};
