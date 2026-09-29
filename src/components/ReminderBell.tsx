import { type FunctionComponent, useEffect, useState } from "react";

import { Icon } from "@iconify/react";

import { css } from "@/../styled-system/css";
import type { TReminderState } from "@/hooks/useReminders";
import { REMINDER_HINTS } from "@/utils/reminder";

const HINT_DURATION_MS = 5000;

type TReminderBellProps = {
	state: TReminderState;
	isPending: boolean;
	toggle: () => Promise<TReminderState>;
};

export const ReminderBell: FunctionComponent<TReminderBellProps> = ({
	state,
	isPending,
	toggle,
}) => {
	const [hint, setHint] = useState<string | null>(null);

	useEffect(() => {
		if (!hint) return;

		const timeout = setTimeout(() => setHint(null), HINT_DURATION_MS);

		return () => clearTimeout(timeout);
	}, [hint]);

	const bellStyle = {
		container: css({
			position: "relative",
			display: "inline-flex",
			padding: 1,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
		}),
		button: css({
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
			_disabled: {
				cursor: "progress",
			},
		}),
		icon: css({
			fontSize: 18,
		}),
		hint: css({
			position: "absolute",
			zIndex: 20,
			top: "calc(100% + token(spacing.2))",
			right: 0,
			width: "max-content",
			maxWidth: "16rem",
			paddingY: 2,
			paddingX: 3,
			color: "text",
			fontSize: "sm",
			lineHeight: 1.4,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
			boxShadow: "lg",
		}),
		// Kept in the page while empty, for screen readers to announce the next hint
		status: css({
			srOnly: true,
		}),
	};

	if (state === "unavailable") return null;

	const isOn = state === "on";
	const label = isOn ? "Stop Grand Prix reminders" : "Remind me of each Grand Prix";
	const icon = {
		on: "mdi:bell-ring",
		blocked: "mdi:bell-off-outline",
		off: "mdi:bell-outline",
		install: "mdi:bell-outline",
	}[state];

	async function handleClick(): Promise<void> {
		if (state === "install" || state === "blocked") {
			setHint(REMINDER_HINTS[state]);
			return;
		}

		const nextState = await toggle();

		setHint(nextState === "blocked" || nextState === "on" ? REMINDER_HINTS[nextState] : null);
	}

	return (
		<div className={bellStyle.container}>
			<button
				type="button"
				onClick={handleClick}
				className={bellStyle.button}
				aria-pressed={state === "on" || state === "off" ? isOn : undefined}
				aria-label={label}
				title={label}
				disabled={isPending}
			>
				<Icon icon={icon} className={bellStyle.icon} />
			</button>
			<p role="status" className={hint ? bellStyle.hint : bellStyle.status}>
				{hint}
			</p>
		</div>
	);
};
