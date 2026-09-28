import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

export const Footer: FunctionComponent = () => {
	const footerStyle = {
		container: css({
			position: "relative",
			paddingBottom: "81px",
			paddingTop: 10,
			paddingX: 4,
			sm: {
				paddingX: 8,
			},
			md: {
				paddingTop: 14,
				paddingX: 16,
			},
			lg: {
				paddingBottom: 10,
				paddingX: 32,
			},
			xl: {
				paddingTop: 24,
				paddingX: 64,
			},
			"2xl": {
				paddingX: 72,
			},
			backgroundColor: "carbon",
			display: "grid",
			gap: 8,
			_before: {
				content: "\"\"",
				position: "absolute",
				insetX: 0,
				top: 0,
				height: 3,
				backgroundImage:
					"repeating-conic-gradient(token(colors.chalk) 0 25%, token(colors.carbon) 0 50%)",
				backgroundSize: "token(spacing.3) token(spacing.3)",
			},
		}),
		disclaimer: css({
			color: "smoke",
		}),
		highlight: css({
			color: "chalk",
			textStyle: "highlight",
		}),
		copyrightContainer: css({
			display: "grid",
			placeContent: "center",
		}),
		copyright: css({
			color: "smoke",
			textStyle: "label",
			"& a": {
				color: "chalk",
				textDecoration: "underline",
				textUnderlineOffset: "3px",
				textDecorationThickness: "2px",
				_hover: {
					textDecorationColor: "f1Red",
				},
			},
		}),
	};

	return (
		<footer className={footerStyle.container}>
			<section>
				<p className={footerStyle.disclaimer}>
					<span className={footerStyle.highlight}>
						Formulix (FMX)
					</span>{" "}
					is an independent fan project and is not affiliated with,
					endorsed by, or associated with Formula One, the FIA, or any
					official Formula 1 teams, sponsors, drivers, or
					organizations. All logos, names, images, and brand
					references belong to their respective owners. This app is
					created solely for informational and entertainment purposes
					and does not intend to infringe on any trademarks or
					copyrights.
				</p>
			</section>
			<section className={footerStyle.copyrightContainer}>
				<p className={footerStyle.copyright}>
					Made with ♥️ by{" "}
					<a
						href="https://baptistemiramont.fr/"
						title="Visit my portfolio"
					>
						Baptiste
					</a>
				</p>
			</section>
		</footer>
	);
};
