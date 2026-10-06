import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import type { TReminders } from "@/hooks/useReminders";
import { useReminderToggle } from "@/hooks/useReminderToggle";
import { hintBubble, hintStatus } from "@/styles/hint";
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
		hint: css(hintBubble),
		status: css(hintStatus),
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
