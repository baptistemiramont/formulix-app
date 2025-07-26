import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { Logo } from "@/components/Logo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ROUTES } from "@/utils/constants";

export const Header: FunctionComponent = () => {
	const headerStyle = {
		headerStyle: css({
			paddingY: 4,
			paddingX: 4,
			position: "fixed",
			zIndex: 10,
			inset: "auto 0 0 0",
			backdropFilter: "auto",
			backdropBlur: "sm",
			lg: {
				paddingX: 8,
				position: "sticky",
				top: 0,
				bottom: "auto",
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			},
			"2xl": {
				paddingX: 20,
			},
		}),
		ulStyle: css({
			display: "grid",
			gap: 4,
			gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
			lg: {
				display: "flex",
				gap: 6,
			},
		}),
		linkStyle: css({
			"&.active p, &.active svg": {
				color: "primary",
			},
		}),
		labelStyle: css({
			width: "fit-content",
			margin: "auto",
			fontSize: "md",
			fontWeight: 600,
			letterSpacing: 1,
			fontVariantCaps: "all-small-caps",
			transition: "var(--default-animation)",
			lg: {
				fontSize: "lg",
			},
			_hover: {
				color: "primary10",
			},
		}),
		iconStyle: css({
			margin: "auto",
			fontSize: 25,
		}),
		logoTextStyle: css({
			fontSize: "2xl",
			fontWeight: 600,
			fontFamily: "League Spartan",
		}),
	};

	const isDesktop = useMediaQuery("(min-width: 1024px)");

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
		<header className={headerStyle.headerStyle}>
			{isDesktop && <Logo />}
			<nav>
				<ul className={headerStyle.ulStyle}>{linksList}</ul>
			</nav>
		</header>
	);
};
