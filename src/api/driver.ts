import { z } from "zod";

import type { TDriverDetailedType, TDriverType } from "@/types/driver";
import { driverDetailedSchema, driverSchema } from "@/types/schemas/driver";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getDrivers(): Promise<TDriverType[]> {
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

	drivers.forEach((driver) => {
		driver.avatar = `${API_URL.replace("/api/v1", "")}${driver.avatar}`;
	});

	return drivers;
}

export async function getDriver(id: number): Promise<TDriverDetailedType> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(`${API_URL}/drivers/${id}`, options);

	if (!response.ok) {
		throw new Error("Failed to fetch driver");
	}

	const { data } = await response.json();

	const { success, data: driver } = driverDetailedSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	driver.avatar = `${API_URL.replace("/api/v1", "")}${driver.avatar}`;

	driver.teams.forEach((team) => {
		team.favicon = `${API_URL.replace("/api/v1", "")}${team.favicon}`;
	});

	return driver;
}
