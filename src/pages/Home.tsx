import { type FunctionComponent, useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { css } from "@/../styled-system/css";
import { fromSettings, scrollOptions, toSettings } from "@/animations";
import landoNorrisCelebrationDesktop from "@/assets/images/lando-norris-celebrating-his-first-victory-in-the-2024-miami-gp_desktop.webp";
import landoNorrisCelebrationMobile from "@/assets/images/lando-norris-celebrating-his-first-victory-in-the-2024-miami-gp_mobile.webp";
import mclarenF1 from "@/assets/images/mclaren-mcl37.webp";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { layoutGutters, sectionSpacing } from "@/styles/layout";

gsap.registerPlugin(ScrollTrigger);

export const Home: FunctionComponent = () => {
	const isDesktop = useMediaQuery("(min-width: 1024px)");

	const refs = {
		heroImage: useRef<HTMLImageElement>(null),
		heroAppName: useRef<HTMLSpanElement>(null),
		heroTitle: useRef<HTMLSpanElement>(null),
		heroSubtitle: useRef<HTMLHeadingElement>(null),
		heroCtasContainer: useRef<HTMLDivElement>(null),
		aboutImage: useRef<HTMLImageElement>(null),
		aboutTitle: useRef<HTMLHeadingElement>(null),
		aboutSubtitle: useRef<HTMLHeadingElement>(null),
		aboutText1: useRef<HTMLParagraphElement>(null),
		aboutText2: useRef<HTMLParagraphElement>(null),
	};

	useGSAP(() => {
		const animations = [
			gsap.from(refs.heroImage.current, {
				...fromSettings.bottom,
			}),
			gsap.from(refs.heroAppName.current, {
				...fromSettings.top,
			}),
			gsap.from(refs.heroTitle.current, {
				...fromSettings.left,
				delay: 0.25,
			}),
			gsap.from(refs.heroSubtitle.current, {
				...fromSettings.left,
				delay: 0.5,
			}),
			gsap.from(refs.heroCtasContainer.current, {
				...fromSettings.left,
				delay: 0.75,
			}),
			gsap.fromTo(refs.aboutImage.current, fromSettings.bottom, {
				...toSettings,
				scrollTrigger: {
					trigger: refs.aboutImage.current,
					...scrollOptions,
					start: "top 80%",
					end: "bottom 70%",
				},
			}),
			gsap.fromTo(refs.aboutTitle.current, fromSettings.right, {
				...toSettings,
				scrollTrigger: {
					trigger: refs.aboutTitle.current,
					...scrollOptions,
					start: "top 80%",
					end: "bottom 70%",
				},
			}),
			gsap.fromTo(refs.aboutSubtitle.current, fromSettings.right, {
				...toSettings,
				scrollTrigger: {
					trigger: refs.aboutSubtitle.current,
					...scrollOptions,
					start: "top 80%",
					end: "bottom 70%",
				},
			}),
			gsap.fromTo(refs.aboutText1.current, fromSettings.right, {
				...toSettings,
				scrollTrigger: {
					trigger: refs.aboutText1.current,
					...scrollOptions,
					start: "top 80%",
					end: "bottom 70%",
				},
			}),
			gsap.fromTo(refs.aboutText2.current, fromSettings.right, {
				...toSettings,
				scrollTrigger: {
					trigger: refs.aboutText2.current,
					...scrollOptions,
					start: "top 80%",
					end: "bottom 70%",
				},
			}),
		];

		return animations;
	}, []);

	const appNameStyle = {
		color: "accentText",
	};

	const heroSectionStyle = {
		section: {
			display: "grid",
			gap: 6,
			alignItems: "center",
			overflowX: "hidden",
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
			gap: 1,
			fontSize: "3xl",
			sm: {
				fontSize: "4xl",
			},
			lg: {
				fontSize: "5xl",
			},
			"& span:first-child": {
				fontSize: "4xl",
				fontWeight: 900,
				fontStyle: "oblique 8deg",
				textTransform: "uppercase",
				sm: {
					fontSize: "5xl",
				},
				lg: {
					fontSize: "7xl",
				},
			},
			"& span:last-child": {
				textTransform: "capitalize",
			},
		},
		subtitle: {
			color: "textMuted",
			fontSize: "lg",
			lg: {
				fontSize: "xl",
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
		heroImageContainer: {
			position: "relative",
			display: "grid",
			placeItems: "center",
			_before: {
				content: "\"\"",
				position: "absolute",
				inset: "12% 4% 12% 18%",
				backgroundColor: "surfaceMuted",
				borderRightWidth: "6px",
				borderColor: "accent",
				transform: "skewX(-14deg)",
			},
		},
		heroImage: {
			position: "relative",
			width: "100%",
			height: "auto",
			lg: {
				maxWidth: "500px",
			},
		},
	};

	const aboutSectionStyle = {
		section: {
			backgroundColor: "surfaceMuted",
			display: "grid",
			placeItems: "center",
			gap: 8,
			overflow: "hidden",
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
					<div
						className={css(
							heroSectionStyle.ctaSectionContentContainer
						)}
					>
						<h1 className={css(heroSectionStyle.title)}>
							<span
								ref={refs.heroAppName}
								className={css(appNameStyle)}
							>
								Formulix
							</span>
							<span ref={refs.heroTitle}>
								Your ultimate F1 companion
							</span>
						</h1>
						<p
							ref={refs.heroSubtitle}
							className={css(heroSectionStyle.subtitle)}
						>
							Explore the rich history and current excitement of
							Formula 1. Follow your favorite drivers and teams
							through over 70 years of thrilling competition.
						</p>
						<div
							ref={refs.heroCtasContainer}
							className={css(heroSectionStyle.ctaContainer)}
						>
							<Button label="Drivers" path="/drivers" />
							<Button
								label="Teams"
								path="/teams"
								variant="secondary"
							/>
						</div>
					</div>
				</div>
				{isDesktop && (
					<div className={css(heroSectionStyle.heroImageContainer)}>
						<img
							ref={refs.heroImage}
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
						<h2 ref={refs.aboutTitle}>
							More about{" "}
							<span className={css(appNameStyle)}>Formulix</span>
						</h2>
						<h3 ref={refs.aboutSubtitle}>
							Purpose of the Application
						</h3>
					</div>
					<p ref={refs.aboutText1}>
						Formulix is a web application dedicated to bringing fans
						closer to the excitement and legacy of the Formula 1
						World Championship. It offers users the chance to dive
						into the sport’s rich history and stay updated on the
						latest thrills, following their favorite drivers and
						teams across more than 70 years of legendary
						competition.
					</p>
					<p ref={refs.aboutText2}>
						At present, the app features information on drivers and
						teams from the latest season. However, our vision is to
						expand and eventually cover the entire history of
						Formula 1, starting from its inception in the 1950s. In
						future updates, we also plan to introduce detailed
						information about the legendary tracks that have shaped
						this iconic sport.
					</p>
				</div>
				<div className={css(aboutSectionStyle.imageContainer)}>
					<picture>
						<source
							srcSet={landoNorrisCelebrationDesktop}
							media="(min-width: 1024px)"
						/>
						<img
							ref={refs.aboutImage}
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
