import type { TOfflineCopy } from "@/types/offline";
import { offlineCopySchema } from "@/types/schemas/offline";
import { API_URL, QUERY_HEADERS } from "@/utils/constants";

export async function getOfflineCopy(): Promise<TOfflineCopy> {
	const options = { headers: QUERY_HEADERS };

	const response = await fetch(`${API_URL}/offline`, options);

	if (!response.ok) {
		throw new Error("Failed to fetch the offline copy");
	}

	const { data } = await response.json();

	const { success, data: offlineCopy } = offlineCopySchema.safeParse(data);

	if (!success) {
		throw new Error("Invalid data format");
	}

	return offlineCopy;
}
