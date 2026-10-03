import type { TDriverDetailed } from "@/types/driver";
import { driverDetailedSchema } from "@/types/schemas/driver";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getDriver(driverSlug: string): Promise<TDriverDetailed> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(`${API_URL}/drivers/${driverSlug}`, options);

	const { message, data } = await response.json();

	if (!response.ok) {
		console.error(message);
		throw new Error("Failed to fetch driver");
	}

	const { success, data: driver } = driverDetailedSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return driver;
}
