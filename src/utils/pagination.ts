// The first page, the last one and the current one with its neighbours; null stands for the pages left out between them
export function listPageNumbers(
	page: number,
	pageCount: number
): (number | null)[] {
	const pages = [...new Set([1, page - 1, page, page + 1, pageCount])]
		.filter((pageNumber) => pageNumber >= 1 && pageNumber <= pageCount)
		.sort((a, b) => a - b);

	return pages.flatMap((pageNumber, index) => {
		const previous = pages[index - 1];

		if (!index || pageNumber - previous === 1) return [pageNumber];

		// A single page left out shows itself: a gap would take the same room
		return pageNumber - previous === 2
			? [previous + 1, pageNumber]
			: [null, pageNumber];
	});
}
