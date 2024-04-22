import { css } from "../../styled-system/css";

export const Home = () => {
	const heroSectionStyle = {
		section: css({
			paddingY: 16,
			minHeight: "75vh",
			height: "100dvh",
			display: "grid",
			gap: 6,
			alignContent: "center",
			lg: {
				paddingY: 24,
				height: "auto",
				gap: 12,
			},
		}),
		title: css({
			display: "grid",
			lg: {
				fontSize: "6xl",
			},
		}),
	};

	return (
		<section className={heroSectionStyle.section}>
			<h1 className={heroSectionStyle.title}>
				Follow your favourite teams and drivers !
			</h1>
			<p>
				Discover over 70 years of competition in the world's greatest motor
				sport.
			</p>
		</section>
	);
};
