import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { useTheme } from "@/hooks/useTheme";

type TThemeToggleProps = {
	hasLabel?: boolean;
};

export const ThemeToggle: FunctionComponent<TThemeToggleProps> = ({
	hasLabel = false,
}) => {
	const { theme, toggleTheme } = useTheme();

	const nextTheme = theme === "dark" ? "light" : "dark";

	const toggleStyle = {
		button: css({
			display: "grid",
			placeItems: "center",
			width: "full",
			color: "textMuted",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
			lg: {
				width: 9,
				height: 9,
				borderWidth: "1px",
				borderColor: "line",
				borderRadius: "md",
				backgroundColor: "surface",
			},
		}),
		icon: css({
			fontSize: 25,
			lg: {
				fontSize: 18,
			},
		}),
		label: css({
			color: "inherit",
			fontSize: "xs",
			fontWeight: 600,
			fontStretch: "112%",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
		}),
	};

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className={toggleStyle.button}
			aria-label={`Switch to ${nextTheme} theme`}
			title={`Switch to ${nextTheme} theme`}
		>
			<Icon
				icon={
					nextTheme === "dark"
						? "mdi:weather-night"
						: "mdi:white-balance-sunny"
				}
				className={toggleStyle.icon}
			/>
			{hasLabel && (
				<p className={toggleStyle.label}>
					{nextTheme === "dark" ? "Dark" : "Light"}
				</p>
			)}
		</button>
	);
};
