import { z } from "zod";

import type { TDriver, TDriverDetailed } from "@/types/driver";
import { driverDetailedSchema, driverSchema } from "@/types/schemas/driver";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getDrivers(): Promise<TDriver[]> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(`${API_URL}/drivers`, options);

	if (!response.ok) {
		throw new Error("Failed to fetch drivers");
	}

	const { data } = await response.json();

	const { success, data: drivers } = z.array(driverSchema).safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return drivers;
}

export async function getDriver(driverSlug: string): Promise<TDriverDetailed> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(`${API_URL}/drivers/${driverSlug}`, options);

	if (!response.ok) {
		throw new Error("Failed to fetch driver");
	}

	const { data } = await response.json();

	const { success, data: driver } = driverDetailedSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return driver;
}
