import { Icon } from "@iconify/react";
import type { FunctionComponent, RefObject } from "react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import { listPageNumbers } from "@/utils/pagination";

type TPaginationProps = {
	page: number;
	pageCount: number;
	onPageChange: (page: number) => void;
	// The section a new page shows from, for a list inside a page; the top of the page otherwise
	scrollTarget?: RefObject<HTMLElement | null>;
};

export const Pagination: FunctionComponent<TPaginationProps> = ({
	page,
	pageCount,
	onPageChange,
	scrollTarget,
}) => {
	if (pageCount <= 1) return null;

	function goTo(nextPage: number): void {
		if (nextPage === page) return;

		onPageChange(nextPage);
		// The new page shows from its first cards, whichever end of the list it was asked from
		if (scrollTarget?.current) {
			scrollTarget.current.scrollIntoView({ block: "start" });
		} else {
			window.scrollTo({ top: 0 });
		}
	}

	const paginationStyle = {
		container: css({
			justifySelf: "center",
			display: "flex",
			alignItems: "center",
			gap: 1,
			padding: 1,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
		}),
		// The page numbers need more room than the narrowest screens give: they show the current page alone
		pages: css({
			display: "none",
			alignItems: "center",
			gap: 1,
			sm: {
				display: "flex",
			},
		}),
		status: css({
			paddingX: 2,
			color: "textMuted",
			textStyle: "label",
			whiteSpace: "nowrap",
			sm: {
				display: "none",
			},
		}),
		button: css({
			display: "grid",
			placeItems: "center",
			minWidth: 8,
			height: 8,
			paddingX: 1,
			color: "textMuted",
			fontWeight: 600,
			fontVariantNumeric: "tabular-nums",
			borderRadius: "sm",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
			_disabled: {
				opacity: 0.4,
				cursor: "default",
				_hover: {
					color: "textMuted",
				},
			},
			"&[aria-current=page]": {
				color: "accentText",
				backgroundColor: "surfaceMuted",
				cursor: "default",
			},
		}),
		gap: css({
			minWidth: 6,
			color: "textMuted",
			textAlign: "center",
		}),
		icon: css({
			fontSize: 20,
		}),
	};

	return (
		<nav aria-label="Pagination" className={paginationStyle.container}>
			<HapticButton
				type="button"
				onClick={() => goTo(page - 1)}
				disabled={page === 1}
				haptic={page > 1}
				aria-label="Previous page"
				title="Previous page"
				className={paginationStyle.button}
			>
				<Icon icon="mdi:chevron-left" className={paginationStyle.icon} />
			</HapticButton>
			<ol className={paginationStyle.pages}>
				{listPageNumbers(page, pageCount).map((pageNumber, index) =>
					pageNumber === null ? (
						<li
							key={`gap-${index}`}
							aria-hidden="true"
							className={paginationStyle.gap}
						>
							…
						</li>
					) : (
						<li key={pageNumber}>
							<HapticButton
								type="button"
								onClick={() => goTo(pageNumber)}
								haptic={pageNumber !== page}
								aria-current={pageNumber === page ? "page" : undefined}
								aria-label={`Page ${pageNumber}`}
								className={paginationStyle.button}
							>
								{pageNumber}
							</HapticButton>
						</li>
					)
				)}
			</ol>
			<span className={paginationStyle.status}>
				Page {page} of {pageCount}
			</span>
			<HapticButton
				type="button"
				onClick={() => goTo(page + 1)}
				disabled={page === pageCount}
				haptic={page < pageCount}
				aria-label="Next page"
				title="Next page"
				className={paginationStyle.button}
			>
				<Icon icon="mdi:chevron-right" className={paginationStyle.icon} />
			</HapticButton>
		</nav>
	);
};
