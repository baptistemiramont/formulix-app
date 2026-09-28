import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle: FunctionComponent = () => {
	const { theme, toggleTheme } = useTheme();

	const nextTheme = theme === "dark" ? "light" : "dark";

	const toggleStyle = {
		button: css({
			display: "grid",
			placeItems: "center",
			width: 9,
			height: 9,
			color: "textMuted",
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
		}),
		icon: css({
			fontSize: 18,
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
		</button>
	);
};
