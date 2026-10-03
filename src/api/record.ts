import type { TRecords } from "@/types/record";
import { recordsSchema } from "@/types/schemas/record";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getRecords(): Promise<TRecords> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(`${API_URL}/records`, options);

	if (!response.ok) {
		throw new Error("Failed to fetch the records");
	}

	const { data } = await response.json();

	const { success, data: records } = recordsSchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return records;
}
