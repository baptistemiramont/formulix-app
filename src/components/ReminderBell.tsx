import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import type { TReminders } from "@/hooks/useReminders";
import { useReminderToggle } from "@/hooks/useReminderToggle";
import { REMINDER_ICONS } from "@/utils/reminder";

export const ReminderBell: FunctionComponent<TReminders> = (reminders) => {
	const { state, isPending } = reminders;
	const { hint, isOn, isToggle, label, handleClick } =
		useReminderToggle(reminders);

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

	const icon = REMINDER_ICONS[state];

	return (
		<div className={bellStyle.container}>
			<HapticButton
				type="button"
				onClick={handleClick}
				className={bellStyle.button}
				aria-pressed={isToggle ? isOn : undefined}
				aria-label={label}
				title={label}
				disabled={isPending}
				haptic={isToggle && !isPending}
			>
				<Icon icon={icon} className={bellStyle.icon} />
			</HapticButton>
			<p role="status" className={hint ? bellStyle.hint : bellStyle.status}>
				{hint}
			</p>
		</div>
	);
};
