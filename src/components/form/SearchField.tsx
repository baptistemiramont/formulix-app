import { type FunctionComponent } from "react";

import { Icon } from "@iconify/react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import { controlFrame, fieldText } from "@/styles/form";

type TSearchFieldProps = {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
};

export const SearchField: FunctionComponent<TSearchFieldProps> = ({
	id,
	label,
	value,
	onChange,
}) => {
	const searchFieldStyle = {
		container: css({
			position: "relative",
			display: "flex",
			alignItems: "center",
		}),
		icon: css({
			position: "absolute",
			left: 3,
			fontSize: 20,
			color: "textMuted",
			pointerEvents: "none",
		}),
		input: css(controlFrame, fieldText, {
			width: "full",
			paddingLeft: 10,
			paddingRight: 11,
			_placeholder: {
				color: "textMuted",
			},
			// The clear button below replaces the one WebKit draws
			"&::-webkit-search-cancel-button": {
				appearance: "none",
			},
		}),
		clear: css({
			position: "absolute",
			right: 1,
			display: "grid",
			placeItems: "center",
			width: 9,
			height: 9,
			color: "textMuted",
			borderRadius: "sm",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "accentText",
			},
		}),
	};

	return (
		<div className={searchFieldStyle.container}>
			<Icon icon="mdi:magnify" className={searchFieldStyle.icon} />
			<input
				id={id}
				type="search"
				value={value}
				onChange={(event) => onChange(event.target.value)}
				placeholder={label}
				aria-label={label}
				autoComplete="off"
				spellCheck={false}
				enterKeyHint="search"
				className={searchFieldStyle.input}
			/>
			{value && (
				<HapticButton
					type="button"
					onClick={() => onChange("")}
					aria-label="Clear the search"
					title="Clear the search"
					className={searchFieldStyle.clear}
				>
					<Icon icon="mdi:close" />
				</HapticButton>
			)}
		</div>
	);
};
