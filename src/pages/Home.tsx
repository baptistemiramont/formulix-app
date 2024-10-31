import { useMediaQuery } from "@/hooks/useMediaQuery";
import { css } from "../../styled-system/css";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { layoutGutters, sectionSpacing } from "@/styles/layout";
import mclarenF1 from "@/../public/assets/images/mclaren-mcl37.webp";
import landoNorrisCelebrationDesktop from "@/../public/assets/images/lando-norris-celebrating-his-first-victory-in-the-2024-miami-gp_desktop.webp";
import landoNorrisCelebrationMobile from "@/../public/assets/images/lando-norris-celebrating-his-first-victory-in-the-2024-miami-gp_mobile.webp";

export const Home = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	// Styles

	const appNameStyle = {
		color: "primary",
	};

	const heroSectionStyle = {
		section: {
			display: "grid",
			gap: 6,
			alignItems: "center",
			lg: {
				gridTemplateColumns: "3fr 2fr",
				gap: 12,
				paddingY: 36,
			},
		},
		ctaSectionContainer: {
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
		},
		ctaSectionContentContainer: {
			display: "grid",
			gap: 6,
		},
		title: {
			display: "grid",
			lg: {
				fontSize: "6xl",
			},
			"& span:last-child": {
				textTransform: "capitalize",
			},
		},
		subtitle: {
			fontSize: "xl",
			lg: {
				fontSize: "2xl",
			},
		},
		ctaContainer: {
			display: "flex",
			gap: 4,
			lg: {
				gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
				gap: 6,
			},
		},
		heroImage: {
			width: "100%",
			height: "auto",
			lg: {
				maxWidth: "500px",
			},
		},
	};

	const aboutSectionStyle = {
		section: {
			backgroundColor: "neutral.200",
			display: "grid",
			placeItems: "center",
			gap: 8,
			lg: {
				gap: 12,
				gridTemplateColumns: "repeat(2, 1fr)",
			},
		},
		aboutContentContainer: {
			display: "grid",
			gap: 6,
		},
		titlesContainer: {
			display: "grid",
			gap: 2,
		},
		imageContainer: {
			lg: {
				order: -1,
			},
		},
		image: {
			width: "100%",
		},
	};

	return (
		<>
			<section className={css(layoutGutters, heroSectionStyle.section)}>
				<div className={css(heroSectionStyle.ctaSectionContainer)}>
					{!isDesktop && <Logo />}
					<div className={css(heroSectionStyle.ctaSectionContentContainer)}>
						<h1 className={css(heroSectionStyle.title)}>
							<span className={css(appNameStyle)}>Formulix</span>
							<span>Your ultimate F1 companion</span>
						</h1>
						<p className={css(heroSectionStyle.subtitle)}>
							Explore the rich history and current excitement of Formula 1.
							Follow your favorite drivers and teams through over 70 years of
							thrilling competition.
						</p>
						<div className={css(heroSectionStyle.ctaContainer)}>
							<Button label="Drivers" path="/drivers" />
							<Button label="Teams" path="/teams" />
						</div>
					</div>
				</div>
				{isDesktop && (
					<div>
						<img
							className={css(heroSectionStyle.heroImage)}
							src={mclarenF1}
							alt="McLaren 2023 F1 car (MCL37)"
							title="McLaren 2023 F1 car (MCL37)"
							width="500"
							loading="lazy"
						/>
					</div>
				)}
			</section>
			<section
				className={css(
					layoutGutters,
					sectionSpacing,
					aboutSectionStyle.section
				)}
			>
				<div className={css(aboutSectionStyle.aboutContentContainer)}>
					<div className={css(aboutSectionStyle.titlesContainer)}>
						<h2>
							More about <span className={css(appNameStyle)}>Formulix</span>
						</h2>
						<h3>Purpose of the Application</h3>
					</div>
					<p>
						Formulix is a web application dedicated to bringing fans closer to
						the excitement and legacy of the Formula 1 World Championship. It
						offers users the chance to dive into the sport’s rich history and
						stay updated on the latest thrills, following their favorite drivers
						and teams across more than 70 years of legendary competition.
					</p>
					<p>
						At present, the app features information on drivers and teams from
						the latest season. However, our vision is to expand and eventually
						cover the entire history of Formula 1, starting from its inception
						in the 1950s. In future updates, we also plan to introduce detailed
						information about the legendary tracks that have shaped this iconic
						sport.
					</p>
				</div>
				<div className={css(aboutSectionStyle.imageContainer)}>
					<picture>
						<source
							srcSet={landoNorrisCelebrationDesktop}
							media="(min-width: 1024px)"
						/>
						<img
							className={css(aboutSectionStyle.image)}
							src={landoNorrisCelebrationMobile}
							alt="Lando Norris celebrating his first GP win (Miami 2024)."
							title="Lando Norris celebrating his first GP win (Miami 2024)."
							width="300"
							loading="lazy"
						/>
					</picture>
				</div>
			</section>
		</>
	);
};
