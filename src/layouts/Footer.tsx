import { css } from "../../styled-system/css";

export const Footer = () => {
	const footerStyle = {
		container: css({
			paddingBottom: "81px",
			paddingTop: 6,
			paddingX: 4,
			sm: {
				paddingX: 8,
			},
			md: {
				paddingTop: 12,
				paddingX: 16,
			},
			lg: {
				paddingX: 32,
			},
			xl: {
				paddingTop: 24,
				paddingX: 64,
			},
			"2xl": {
				paddingX: 72,
			},
			backgroundColor: "neutral.200",
			display: "grid",
			gap: 8,
			boxShadow: "hsla(210, 8%, 62%, 0.1) 0px -8px 24px",
		}),
		disclaimer: css({
			color: "neutral.500",
		}),
		highlight: css({
			textStyle: "highlight",
		}),
		copyrightContainer: css({
			display: "grid",
			placeContent: "center",
		}),
		copyright: css({
			color: "neutral.500",
			textStyle: "label",
		}),
	};

	return (
		<footer className={footerStyle.container}>
			<section>
				<p className={footerStyle.disclaimer}>
					<span className={footerStyle.highlight}>Formulix (FMX)</span> is an
					independent fan project and is not affiliated with, endorsed by, or
					associated with Formula One, the FIA, or any official Formula 1 teams,
					sponsors, drivers, or organizations. All logos, names, images, and
					brand references belong to their respective owners. This app is
					created solely for informational and entertainment purposes and does
					not intend to infringe on any trademarks or copyrights.
				</p>
			</section>
			<section className={footerStyle.copyrightContainer}>
				<p className={footerStyle.copyright}>
					Made with ♥️ by{" "}
					<a href="https://baptistemiramont.fr/" title="Visit my portfolio">
						Baptiste
					</a>
				</p>
			</section>
		</footer>
	);
};
