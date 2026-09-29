import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { Logo } from "@/components/Logo";
import { ReminderBell } from "@/components/ReminderBell";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReminders } from "@/hooks/useReminders";
import { ROUTES } from "@/utils/constants";

export const Header: FunctionComponent = () => {
	const headerStyle = {
		headerStyle: css({
			paddingTop: 3,
			// The links keep clear of the iPhone home indicator, and of the notch in landscape, like a native tab bar
			paddingRight: "max(token(spacing.4), env(safe-area-inset-right))",
			paddingBottom: "max(token(spacing.3), env(safe-area-inset-bottom))",
			paddingLeft: "max(token(spacing.4), env(safe-area-inset-left))",
			position: "fixed",
			zIndex: 10,
			inset: "auto 0 0 0",
			backgroundColor: "bg/85",
			borderTopWidth: "1px",
			borderColor: "line",
			backdropFilter: "auto",
			backdropBlur: "sm",
			lg: {
				paddingY: 4,
				paddingX: 8,
				position: "sticky",
				top: 0,
				bottom: "auto",
				borderTopWidth: 0,
				borderBottomWidth: "1px",
				display: "grid",
				gridTemplateColumns: "1fr auto 1fr",
				alignItems: "center",
			},
			"2xl": {
				paddingX: 20,
			},
		}),
		ulStyle: css({
			display: "grid",
			gap: 4,
			gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
			lg: {
				display: "flex",
				gap: 8,
			},
		}),
		linkStyle: css({
			display: "grid",
			color: "textMuted",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
			"&.active": {
				color: "accentText",
				lg: {
					color: "text",
				},
			},
			"&.active p::after": {
				lg: {
					content: "\"\"",
					position: "absolute",
					insetX: 0,
					bottom: "-2px",
					height: "3px",
					backgroundColor: "accent",
					transform: "skewX(-20deg)",
				},
			},
		}),
		labelStyle: css({
			position: "relative",
			width: "fit-content",
			margin: "auto",
			color: "inherit",
			fontSize: "xs",
			fontWeight: 600,
			fontStretch: "112%",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			lg: {
				fontSize: "sm",
				paddingY: 1,
			},
		}),
		iconStyle: css({
			margin: "auto",
			fontSize: 25,
		}),
		desktopSwitcherStyle: css({
			justifySelf: "end",
			display: "flex",
			gap: 2,
		}),
		mobileBarStyle: css({
			display: "flex",
			justifyContent: "flex-end",
			gap: 2,
			// Clears the status bar whenever the app is drawn under it
			paddingTop: "max(token(spacing.3), env(safe-area-inset-top))",
			paddingX: 4,
			sm: {
				paddingX: 8,
			},
		}),
	};

	const isDesktop = useMediaQuery("(min-width: 1024px)");
	// Here rather than in the bell: the mobile and desktop bars each show one, and switch at the first render
	const reminders = useReminders();

	const links = [
		{
			href: ROUTES.HOME,
			icon: <Icon icon="mdi-home" className={headerStyle.iconStyle} />,
			label: "Home",
		},
		{
			href: ROUTES.DRIVERS,
			icon: (
				<Icon
					icon="mdi-racing-helmet"
					className={headerStyle.iconStyle}
				/>
			),
			label: "Drivers",
		},
		{
			href: ROUTES.TEAMS,
			icon: (
				<Icon
					icon="mdi-flag-checkered"
					className={headerStyle.iconStyle}
				/>
			),
			label: "Teams",
		},
		{
			href: ROUTES.CIRCUITS,
			icon: (
				<Icon
					icon="mdi-go-kart-track"
					className={headerStyle.iconStyle}
				/>
			),
			label: "Circuits",
		},
	];

	const linksList = links.map((link) => {
		return (
			<li key={link.href}>
				<Link to={link.href} className={headerStyle.linkStyle}>
					{!isDesktop && link.icon}
					<p className={headerStyle.labelStyle}>{link.label}</p>
				</Link>
			</li>
		);
	});

	return (
		<>
			{!isDesktop && (
				<div className={headerStyle.mobileBarStyle}>
					<ThemeSwitcher />
					<ReminderBell {...reminders} />
				</div>
			)}
			<header className={headerStyle.headerStyle}>
				{isDesktop && <Logo />}
				<nav>
					<ul className={headerStyle.ulStyle}>{linksList}</ul>
				</nav>
				{isDesktop && (
					<div className={headerStyle.desktopSwitcherStyle}>
						<ThemeSwitcher />
						<ReminderBell {...reminders} />
					</div>
				)}
			</header>
		</>
	);
};
