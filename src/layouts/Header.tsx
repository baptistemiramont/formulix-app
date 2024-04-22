import { css } from "../../styled-system/css/css";
import { useMediaQuery } from "../hooks";
import { Icon } from "@iconify/react";

export const Header = () => {
	const headerStyle = css({
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
	});

	const ulStyle = css({
		display: "grid",
		gap: 4,
		gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
		lg: {
			display: "flex",
			gap: 6,
		},
	});

	const labelStyle = css({
		width: "fit-content",
		margin: "auto",
		fontSize: "md",
		fontWeight: 600,
		letterSpacing: 1,
		fontVariantCaps: "all-small-caps",
		lg: {
			fontSize: "lg",
		},
	});

	const iconStyle = css({
		margin: "auto",
		fontSize: 25,
	});

	const logoTextStyle = css({
		fontSize: "2xl",
		fontWeight: 600,
		fontFamily: "ClashGrotesk",
	});

	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const links = [
		{
			href: "/drivers",
			icon: <Icon icon="mdi-racing-helmet" className={iconStyle} />,
			label: "Drivers",
		},
		{
			href: "/teams",
			icon: <Icon icon="mdi-flag-checkered" className={iconStyle} />,
			label: "Teams",
		},
	];

	const linksList = links.map((link) => {
		return (
			<li key={link.href}>
				<a href={link.href}>
					{!isDesktop && link.icon}
					<p className={labelStyle}>{link.label}</p>
				</a>
			</li>
		);
	});

	return (
		<header className={headerStyle}>
			{isDesktop && (
				<a href="/" className={logoTextStyle} title="Back to home page">
					FMX
				</a>
			)}
			<nav>
				<ul className={ulStyle}>{linksList}</ul>
			</nav>
		</header>
	);
};
