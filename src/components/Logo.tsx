import { Link } from "@tanstack/react-router";
import { css } from "@/../styled-system/css";

export const Logo = (): JSX.Element => {
	const logoTextStyle = css({
		fontSize: "4xl",
		fontWeight: 700,
		fontFamily: "League Spartan",
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
