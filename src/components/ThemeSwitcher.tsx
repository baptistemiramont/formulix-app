import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { type TThemePreference, useTheme } from "@/hooks/useTheme";

const THEME_OPTIONS: {
	value: TThemePreference;
	label: string;
	icon: string;
}[] = [
	{ value: "system", label: "System theme", icon: "mdi:monitor" },
	{ value: "light", label: "Light theme", icon: "mdi:white-balance-sunny" },
	{ value: "dark", label: "Dark theme", icon: "mdi:weather-night" },
];

export const ThemeSwitcher: FunctionComponent = () => {
	const { preference, setPreference } = useTheme();

	const switcherStyle = {
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
		<div role="group" aria-label="Theme" className={switcherStyle.group}>
			{THEME_OPTIONS.map(({ value, label, icon }) => (
				<button
					key={value}
					type="button"
					onClick={() => setPreference(value)}
					className={switcherStyle.option}
					aria-pressed={preference === value}
					aria-label={label}
					title={label}
				>
					<Icon icon={icon} className={switcherStyle.icon} />
				</button>
			))}
		</div>
	);
};
