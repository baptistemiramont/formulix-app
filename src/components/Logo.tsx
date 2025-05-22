import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

export const Logo: FunctionComponent = () => {
	const logoTextStyle = css({
		fontSize: "4xl",
		fontWeight: 700,
		fontFamily: "League Spartan",
		transition: "var(--default-animation)",
		_hover: {
			color: "primary",
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
