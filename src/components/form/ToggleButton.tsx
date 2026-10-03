import { type FunctionComponent } from "react";

import { Icon } from "@iconify/react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import { controlFrame, pressedStyle } from "@/styles/form";

type TToggleButtonProps = {
	label: string;
	icon: string;
	pressed: boolean;
	onChange: (pressed: boolean) => void;
};

// A filter on or off, its mark lit in red like a start light when on
export const ToggleButton: FunctionComponent<TToggleButtonProps> = ({
	label,
	icon,
	pressed,
	onChange,
}) => {
	const toggleStyle = {
		button: css(
			controlFrame,
			{
				flex: "0 0 auto",
				display: "flex",
				alignItems: "center",
				gap: 2,
				paddingX: 3,
				color: "textMuted",
				textStyle: "label",
				whiteSpace: "nowrap",
				cursor: "pointer",
				transition: "var(--default-animation)",
				// A filter on keeps its red under the pointer
				"&:not([aria-pressed=true]):hover": {
					color: "text",
				},
				// The slanted mark of the card subtitles
				_before: {
					content: "\"\"",
					flexShrink: 0,
					width: 2,
					height: 2,
					backgroundColor: "line",
					transform: "skewX(-20deg)",
				},
				"&[aria-pressed=true]::before": {
					backgroundColor: "accent",
				},
			},
			pressedStyle
		),
		icon: css({
			fontSize: 18,
		}),
	};

	return (
		<HapticButton
			type="button"
			onClick={() => onChange(!pressed)}
			aria-pressed={pressed}
			className={toggleStyle.button}
		>
			<Icon icon={icon} className={toggleStyle.icon} />
			{label}
		</HapticButton>
	);
};
