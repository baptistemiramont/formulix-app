import type { TCircuitDetailed } from "@/types/circuit";
import { circuitDetailedSchema } from "@/types/schemas/circuit";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getCircuit(
	circuitSlug: string
): Promise<TCircuitDetailed> {
	const options = {
		headers: QUERY_HEADERS,
	};

	const response = await fetch(`${API_URL}/circuits/${circuitSlug}`, options);

	if (!response.ok) {
		throw new Error("Failed to fetch circuit data");
	}

	const { data } = await response.json();

	const { success, data: circuit } = circuitDetailedSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return circuit;
}
