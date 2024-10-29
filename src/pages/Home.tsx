import { useMediaQuery } from "@/hooks/useMediaQuery";
import { css } from "../../styled-system/css";
import { Button } from "../components/Button";
import mclarenF1 from "@/../public/assets/images/mclaren-mcl37.webp";
import { Logo } from "@/components/Logo";

export const Home = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	// Styles

	const pageStyle = {
		heroSection: css({
			display: "grid",
			gap: 6,
			alignItems: "center",
			lg: {
				gridTemplateColumns: "60% 40%",
				gap: 12,
				paddingY: 36,
			},
		}),
		ctaSectionContainer: css({
			paddingY: 8,
			display: "grid",
			gap: "25dvh",
			placeItems: "center",
			placeContent: "start",
			height: "100dvh",
			lg: {
				paddingY: 0,
				height: "auto",
				gap: 12,
			},
		}),
		ctaSectionContentContainer: css({
			display: "grid",
			gap: 6,
		}),
		title: css({
			display: "grid",
			lg: {
				fontSize: "6xl",
			},
			"& span:last-child": {
				textTransform: "capitalize",
			},
		}),
		appName: css({
			color: "primary",
		}),
		subtitle: css({
			fontSize: "xl",
			lg: {
				fontSize: "2xl",
			},
		}),
		ctaContainer: css({
			display: "flex",
			gap: 4,
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
				gap: 6,
			},
		}),
		heroImageContainer: css({}),
		heroImage: css({
			width: "100%",
			height: "auto",
			lg: {
				maxWidth: "500px",
			},
		}),
	};

	return (
		<section className={pageStyle.heroSection}>
			<div className={pageStyle.ctaSectionContainer}>
				{!isDesktop && <Logo />}
				<div className={pageStyle.ctaSectionContentContainer}>
					<h1 className={pageStyle.title}>
						<span className={pageStyle.appName}>Formulix</span>
						<span>Your ultimate F1 companion</span>
					</h1>
					<p className={pageStyle.subtitle}>
						Explore the rich history and current excitement of Formula 1. Follow
						your favorite drivers and teams through over 70 years of thrilling
						competition.
					</p>
					<div className={pageStyle.ctaContainer}>
						<Button label="Drivers" path="/drivers" />
						<Button label="Teams" path="/teams" />
					</div>
				</div>
			</div>
			{isDesktop && (
				<div className={pageStyle.heroImageContainer}>
					<img
						className={pageStyle.heroImage}
						src={mclarenF1}
						alt="McLaren 2023 F1 car (MCL37)"
						title="McLaren 2023 F1 car (MCL37)"
						width="500"
						loading="lazy"
					/>
				</div>
			)}
		</section>
	);
};
