import type { FunctionComponent } from "react";

import { IconSwitch } from "@/components/IconSwitch";
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

	return (
		<IconSwitch
			label="Theme"
			options={THEME_OPTIONS}
			value={preference}
			onChange={setPreference}
		/>
	);
};
