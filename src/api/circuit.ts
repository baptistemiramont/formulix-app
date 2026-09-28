import { z } from "zod";

import type { TCircuit, TCircuitDetailed } from "@/types/circuit";
import { circuitDetailedSchema, circuitSchema } from "@/types/schemas/circuit";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getCircuits(): Promise<TCircuit[]> {
	const options = {
		headers: QUERY_HEADERS,
	};

	const response = await fetch(`${API_URL}/circuits`, options);

	if (!response.ok) {
		throw new Error(`HTTP error ! status: ${response.status}`);
	}

	const { data } = await response.json();

	const { success, data: circuits } = z.array(circuitSchema).safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return circuits;
}

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
