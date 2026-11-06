import { Icon } from "@iconify/react";
import type { ReactElement } from "react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";

type TIconSwitchProps<T extends string> = {
	label: string;
	options: { value: T; label: string; icon: string }[];
	value: T;
	onChange: (value: T) => void;
};

// A choice among a few values, each an icon named by its label, such as the theme or a list's view
export const IconSwitch = <T extends string>({
	label,
	options,
	value,
	onChange,
}: TIconSwitchProps<T>): ReactElement => {
	const switchStyle = {
		group: css({
			display: "inline-flex",
			gap: 1,
			padding: 1,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
		}),
		option: css({
			display: "grid",
			placeItems: "center",
			width: 8,
			height: 8,
			color: "textMuted",
			borderRadius: "sm",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
			"&[aria-pressed=true]": {
				color: "accentText",
				backgroundColor: "surfaceMuted",
			},
		}),
		icon: css({
			fontSize: 18,
		}),
	};

	return (
		<div role="group" aria-label={label} className={switchStyle.group}>
			{options.map((option) => (
				<HapticButton
					key={option.value}
					type="button"
					onClick={() => onChange(option.value)}
					className={switchStyle.option}
					aria-pressed={value === option.value}
					aria-label={option.label}
					title={option.label}
					haptic={value !== option.value}
				>
					<Icon icon={option.icon} className={switchStyle.icon} />
				</HapticButton>
			))}
		</div>
	);
};
