import {
	type FormEvent,
	type FunctionComponent,
	type PropsWithChildren,
} from "react";

import { Icon } from "@iconify/react";

import { css } from "@/../styled-system/css";
import { SearchField } from "@/components/form/SearchField";
import { HapticButton } from "@/components/HapticButton";

type TFilterPanelProps = PropsWithChildren<{
	search: {
		id: string;
		label: string;
		value: string;
		onChange: (value: string) => void;
	};
	// Unknown until the first page arrives
	total: number | undefined;
	itemName: { one: string; other: string };
	isFiltered: boolean;
	onClear: () => void;
}>;

// The search, the filters given as children, and how many items they leave
export const FilterPanel: FunctionComponent<TFilterPanelProps> = ({
	search,
	total,
	itemName,
	isFiltered,
	onClear,
	children,
}) => {
	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		// The list follows the typing already: the keyboard steps aside to show it
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
	}

	const filterPanelStyle = {
		panel: css({
			display: "grid",
			gap: 4,
			padding: 4,
			backgroundColor: "surface",
			// The corner of the cards, in the red of the titles
			borderTopWidth: "2px",
			borderRightWidth: "2px",
			borderColor: "accent",
			borderTopRightRadius: "2xl",
			lg: {
				padding: 5,
			},
		}),
		fields: css({
			display: "flex",
			flexWrap: "wrap",
			alignItems: "end",
			gap: 3,
			lg: {
				gap: 4,
			},
		}),
		footer: css({
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			gap: 3,
			minHeight: 8,
			paddingTop: 3,
			borderTopWidth: "1px",
			borderColor: "line",
		}),
		count: css({
			display: "flex",
			alignItems: "center",
			gap: 2,
			color: "textMuted",
			textStyle: "label",
			// The slanted mark of the card subtitles
			_before: {
				content: "\"\"",
				flexShrink: 0,
				width: 2,
				height: 2,
				backgroundColor: "accent",
				transform: "skewX(-20deg)",
			},
		}),
		total: css({
			color: "text",
			textStyle: "figure",
			fontSize: "md",
			lg: {
				fontSize: "lg",
			},
		}),
		clear: css({
			display: "flex",
			alignItems: "center",
			gap: 1,
			color: "textMuted",
			textStyle: "label",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "accentText",
			},
		}),
	};

	return (
		<form
			role="search"
			onSubmit={handleSubmit}
			className={filterPanelStyle.panel}
		>
			<SearchField {...search} />
			<div className={filterPanelStyle.fields}>{children}</div>
			<div className={filterPanelStyle.footer}>
				<p aria-live="polite" className={filterPanelStyle.count}>
					{total !== undefined && (
						<>
							<span className={filterPanelStyle.total}>{total}</span>
							{total === 1 ? itemName.one : itemName.other}
						</>
					)}
				</p>
				{isFiltered && (
					<HapticButton
						type="button"
						onClick={onClear}
						className={filterPanelStyle.clear}
					>
						<Icon icon="mdi:close" />
						Clear filters
					</HapticButton>
				)}
			</div>
		</form>
	);
};
