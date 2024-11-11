import { layoutGutters, sectionSpacing } from "@/styles/layout";
import { css } from "@/../styled-system/css";
import { Button } from "@/components/Button";

export const NotFound = () => {
	const pageStyle = {
		section: {
			display: "grid",
			gap: 4,
		},
		title: {
			display: "grid",
		},
	};

	return (
		<section className={css(layoutGutters, sectionSpacing, pageStyle.section)}>
			<h1 className={css(pageStyle.title)}>
				<span>Error 404</span>
				<span>Page out of track limits !</span>
			</h1>
			<p>
				You've gone a bit wide ! Just like a daring overtake that didn't quite
				stick. 🚩 Head back to the main straight, and let's give it another go !
			</p>
			<Button label="Return to home" path="/" />
		</section>
	);
};
