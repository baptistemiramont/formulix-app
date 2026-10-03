import type { TNextGrandPrix } from "@/types/calendar";
import { nextGrandPrixSchema } from "@/types/schemas/calendar";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

// Null when no Grand Prix is to come, until the next season's calendar is out
export async function getNextGrandPrix(): Promise<TNextGrandPrix | null> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(`${API_URL}/calendar/next`, options);

	if (response.status === 404) return null;

	if (!response.ok) {
		throw new Error("Failed to fetch the next Grand Prix");
	}

	const { data } = await response.json();

	const { success, data: grandPrix } = nextGrandPrixSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return grandPrix;
}
