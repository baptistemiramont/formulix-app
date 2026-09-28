import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

export const Logo: FunctionComponent = () => {
	const logoTextStyle = css({
		display: "inline-flex",
		alignItems: "center",
		gap: "0.25em",
		width: "fit-content",
		color: "text",
		fontSize: "4xl",
		fontWeight: 900,
		fontFamily: "saira",
		fontStretch: "125%",
		fontStyle: "oblique 10deg",
		letterSpacing: "-0.02em",
		lineHeight: 1,
		transition: "var(--default-animation)",
		_before: {
			content: "\"\"",
			width: "0.8em",
			height: "0.62em",
			backgroundImage:
				"repeating-linear-gradient(to bottom, token(colors.accent) 0 0.14em, transparent 0.14em 0.24em)",
			transform: "skewX(-20deg)",
		},
		_hover: {
			color: "accentText",
		},
		lg: {
			fontSize: "2xl",
		},
	});

	return (
		<Link to="/" className={logoTextStyle} title="Back to home page">
			FMX
		</Link>
	);
};
