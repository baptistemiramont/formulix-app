import { z } from "zod";

import { toListUrl } from "@/api/list";
import type { TCircuitDetailed, TCircuitOnMap } from "@/types/circuit";
import type { TListQuery } from "@/types/list";
import {
	circuitDetailedSchema,
	circuitOnMapSchema,
} from "@/types/schemas/circuit";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

// Without a page, the API answers every circuit the search and filters keep: the map shows them all at once
export async function getCircuitsOnMap(
	query: TListQuery
): Promise<TCircuitOnMap[]> {
	const options = {
		headers: QUERY_HEADERS,
	};

	const response = await fetch(toListUrl("circuits", query), options);

	if (!response.ok) {
		throw new Error("Failed to fetch circuits");
	}

	const { data } = await response.json();

	const { success, data: circuits } = z
		.array(circuitOnMapSchema)
		.safeParse(data);

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
