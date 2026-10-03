import { type FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import { controlFrame, fieldContainer, pressedStyle } from "@/styles/form";

type TSegmentedControlProps = {
	id: string;
	label: string;
	options: { label: string; value: string }[];
	value: string;
	onChange: (value: string) => void;
};

// A choice among a few values, all in sight, as the theme switcher offers
export const SegmentedControl: FunctionComponent<TSegmentedControlProps> = ({
	id,
	label,
	options,
	value,
	onChange,
}) => {
	const labelId = `${id}-label`;

	const segmentedStyle = {
		container: css(fieldContainer, {
			flex: "1 1 16rem",
			lg: {
				flex: "0 0 auto",
			},
		}),
		label: css({
			color: "textMuted",
			textStyle: "label",
		}),
		group: css(controlFrame, {
			display: "flex",
			gap: 1,
			padding: 1,
		}),
		option: css(
			{
				flex: 1,
				paddingX: 3,
				color: "textMuted",
				textStyle: "label",
				whiteSpace: "nowrap",
				borderRadius: "sm",
				cursor: "pointer",
				transition: "var(--default-animation)",
				// The value chosen keeps its red under the pointer
				"&:not([aria-pressed=true]):hover": {
					color: "text",
				},
			},
			pressedStyle
		),
	};

	return (
		<div className={segmentedStyle.container}>
			<span id={labelId} className={segmentedStyle.label}>
				{label}
			</span>
			<div
				role="group"
				aria-labelledby={labelId}
				className={segmentedStyle.group}
			>
				{options.map((option) => (
					<HapticButton
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						aria-pressed={value === option.value}
						haptic={value !== option.value}
						className={segmentedStyle.option}
					>
						{option.label}
					</HapticButton>
				))}
			</div>
		</div>
	);
};
