import { type FunctionComponent, type ReactNode, useEffect } from "react";

import { Icon } from "@iconify/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { css } from "@/../styled-system/css";
import { CircuitLayout } from "@/components/CircuitLayout";
import { HapticButton } from "@/components/HapticButton";
import { useCountdown } from "@/hooks/useCountdown";
import { useReminderToggle } from "@/hooks/useReminderToggle";
import { useSharedReminders } from "@/hooks/useSharedReminders";
import type { TNextGrandPrix } from "@/types/calendar";
import {
	formatRaceDay,
	formatRaceStart,
	splitCountdown,
} from "@/utils/calendar";
import { getLayoutUrl, toFlagUrl } from "@/utils/circuit";
import { ROUTES } from "@/utils/constants";
import { REMINDER_HINTS, REMINDER_ICONS } from "@/utils/reminder";

type TNextGrandPrixCardProps = {
	// Null when no Grand Prix is to come, until the next season's calendar is out
	grandPrix: TNextGrandPrix | null;
};

const COUNTDOWN_UNITS = [
	{ key: "days", label: "Days" },
	{ key: "hours", label: "Hrs" },
	{ key: "minutes", label: "Min" },
	{ key: "seconds", label: "Sec" },
] as const;

const REMINDER_LABELS = {
	off: "Remind me",
	on: "Reminders on",
	blocked: "Reminders blocked",
} as const;

const nextGrandPrixCardStyle = {
	container: css({
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		gap: 4,
		padding: 4,
		backgroundColor: "surface",
		borderTopWidth: "2px",
		borderRightWidth: "2px",
		borderColor: "accent",
		borderTopRightRadius: "2xl",
		lg: {
			gap: 5,
			padding: 6,
		},
	}),
	heading: css({
		display: "grid",
		gap: 1,
	}),
	eyebrow: css({
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		columnGap: 2,
		color: "textMuted",
		textStyle: "label",
	}),
	eyebrowAccent: css({
		color: "accentText",
	}),
	name: css({
		fontSize: "2xl",
		lg: {
			fontSize: "3xl",
		},
	}),
	circuitLink: css({
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		gap: 3,
		color: "text",
		transition: "var(--default-animation)",
		_hover: {
			color: "accentText",
		},
	}),
	circuit: css({
		display: "flex",
		alignItems: "center",
		gap: 2,
	}),
	flag: css({
		flexShrink: 0,
		width: 6,
		height: "auto",
		borderRadius: "2px",
		boxShadow: "0 0 0 1px token(colors.line)",
	}),
	circuitName: css({
		color: "inherit",
		fontWeight: 700,
		lineHeight: 1.3,
		overflowWrap: "anywhere",
	}),
	locality: css({
		color: "textMuted",
		textStyle: "label",
	}),
	layout: css({
		height: 32,
		sm: {
			height: 40,
		},
		lg: {
			height: 48,
		},
	}),
	start: css({
		display: "flex",
		alignItems: "center",
		gap: 2,
		fontWeight: 600,
		"& svg": {
			flexShrink: 0,
			color: "accentText",
		},
	}),
	countdown: css({
		display: "grid",
		gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
		gap: 2,
	}),
	countdownUnit: css({
		display: "grid",
		justifyItems: "center",
		paddingY: 2,
		backgroundColor: "surfaceMuted",
		borderRadius: "sm",
	}),
	countdownValue: css({
		textStyle: "figure",
		fontSize: "2xl",
		lg: {
			fontSize: "3xl",
		},
	}),
	countdownLabel: css({
		color: "textMuted",
		textStyle: "label",
	}),
	lightsOut: css({
		color: "accentText",
		textStyle: "figure",
		fontSize: "2xl",
		textTransform: "uppercase",
	}),
	reminder: css({
		position: "relative",
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		gap: 3,
	}),
	reminderButton: css({
		display: "inline-flex",
		alignItems: "center",
		gap: 2,
		paddingY: 2.5,
		paddingX: 7,
		color: "white",
		backgroundColor: "accent",
		clipPath:
			"polygon(0.75rem 0, 100% 0, calc(100% - 0.75rem) 100%, 0 100%)",
		fontSize: "sm",
		fontWeight: 700,
		fontStretch: "112%",
		letterSpacing: "0.08em",
		textTransform: "uppercase",
		cursor: "pointer",
		transition: "var(--default-animation)",
		_hover: {
			backgroundColor: "accentHover",
		},
		"&[aria-pressed=true], &[data-state=blocked]": {
			color: "bg",
			backgroundColor: "text",
		},
		_disabled: {
			cursor: "progress",
		},
	}),
	reminderHint: css({
		color: "textMuted",
		fontSize: "sm",
		lineHeight: 1.4,
	}),
	// Kept in the page while empty, for screen readers to announce the next hint
	reminderStatus: css({
		srOnly: true,
	}),
	install: css({
		display: "flex",
		alignItems: "start",
		gap: 2,
		padding: 3,
		color: "textMuted",
		fontSize: "sm",
		lineHeight: 1.4,
		backgroundColor: "surfaceMuted",
		borderRadius: "sm",
		"& svg": {
			flexShrink: 0,
			marginTop: 0.5,
			color: "accentText",
			fontSize: "lg",
		},
	}),
};

export const NextGrandPrixCard: FunctionComponent<TNextGrandPrixCardProps> = ({
	grandPrix,
}) => {
	if (!grandPrix) {
		return (
			<article className={nextGrandPrixCardStyle.container}>
				<p className={nextGrandPrixCardStyle.eyebrow}>
					<span className={nextGrandPrixCardStyle.eyebrowAccent}>
						Next Grand Prix
					</span>
				</p>
				<p>
					The next season's calendar is not out yet: the countdown
					starts again as soon as it is.
				</p>
			</article>
		);
	}

	return <UpcomingGrandPrix grandPrix={grandPrix} />;
};

const UpcomingGrandPrix: FunctionComponent<{ grandPrix: TNextGrandPrix }> = ({
	grandPrix,
}) => {
	const { round, roundCount, name, raceDay, startsAt, circuit } = grandPrix;
	const start = startsAt ? new Date(startsAt) : null;
	const remaining = useCountdown(start);
	const queryClient = useQueryClient();
	const reminders = useSharedReminders();
	const { hint, isOn, isToggle, label, handleClick } =
		useReminderToggle(reminders);
	const layoutUrl = getLayoutUrl(circuit.slug);

	useEffect(() => {
		// The lights are out: the next Grand Prix takes its place
		if (remaining === 0) {
			queryClient.invalidateQueries({ queryKey: ["getNextGrandPrix"] });
		}
	}, [remaining, queryClient]);

	let countdown: ReactNode = null;

	if (remaining === 0) {
		countdown = <p className={nextGrandPrixCardStyle.lightsOut}>Lights out</p>;
	} else if (remaining !== null) {
		const parts = splitCountdown(remaining);

		countdown = (
			<ol
				className={nextGrandPrixCardStyle.countdown}
				aria-label="Time left before the race start"
			>
				{COUNTDOWN_UNITS.map(({ key, label: unitLabel }) => (
					<li key={key} className={nextGrandPrixCardStyle.countdownUnit}>
						<span className={nextGrandPrixCardStyle.countdownValue}>
							{String(parts[key]).padStart(2, "0")}
						</span>
						<span className={nextGrandPrixCardStyle.countdownLabel}>
							{unitLabel}
						</span>
					</li>
				))}
			</ol>
		);
	}

	let reminder: ReactNode = null;

	if (reminders.state === "install") {
		reminder = (
			<p className={nextGrandPrixCardStyle.install}>
				<Icon icon="mdi:cellphone-arrow-down" />
				{REMINDER_HINTS.install}
			</p>
		);
	} else if (reminders.state !== "unavailable") {
		reminder = (
			<div className={nextGrandPrixCardStyle.reminder}>
				<HapticButton
					type="button"
					onClick={handleClick}
					className={nextGrandPrixCardStyle.reminderButton}
					aria-pressed={isToggle ? isOn : undefined}
					data-state={reminders.state}
					title={label}
					disabled={reminders.isPending}
					haptic={isToggle && !reminders.isPending}
				>
					<Icon icon={REMINDER_ICONS[reminders.state]} />
					{REMINDER_LABELS[reminders.state]}
				</HapticButton>
				<p
					role="status"
					className={
						hint
							? nextGrandPrixCardStyle.reminderHint
							: nextGrandPrixCardStyle.reminderStatus
					}
				>
					{hint}
				</p>
			</div>
		);
	}

	return (
		<article className={nextGrandPrixCardStyle.container}>
			<div className={nextGrandPrixCardStyle.heading}>
				<p className={nextGrandPrixCardStyle.eyebrow}>
					<span className={nextGrandPrixCardStyle.eyebrowAccent}>
						Next Grand Prix
					</span>
					<span>
						Round {round} of {roundCount}
					</span>
				</p>
				<h2 className={nextGrandPrixCardStyle.name}>{name}</h2>
			</div>
			<Link
				to={ROUTES.CIRCUIT}
				params={{ circuitSlug: circuit.slug }}
				className={nextGrandPrixCardStyle.circuitLink}
			>
				<span className={nextGrandPrixCardStyle.circuit}>
					<img
						className={nextGrandPrixCardStyle.flag}
						src={toFlagUrl(circuit.countryCode)}
						alt={`${circuit.country}'s flag`}
						width="24"
					/>
					<span>
						<span className={nextGrandPrixCardStyle.circuitName}>
							{circuit.name}
						</span>
						<br />
						<span className={nextGrandPrixCardStyle.locality}>
							{circuit.locality}, {circuit.country}
						</span>
					</span>
				</span>
				{layoutUrl && (
					<CircuitLayout
						url={layoutUrl}
						label={`${circuit.name}'s layout`}
						className={nextGrandPrixCardStyle.layout}
					/>
				)}
			</Link>
			<p className={nextGrandPrixCardStyle.start}>
				<Icon icon="mdi:flag-checkered" />
				{start
					? formatRaceStart(start)
					: `${formatRaceDay(raceDay)}, start time to be confirmed`}
			</p>
			{countdown}
			{reminder}
		</article>
	);
};
