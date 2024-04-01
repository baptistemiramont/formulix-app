import { defineConfig, defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
	body: {
		description: "The body text style - used in paragraphs",
		value: {
			color: "neutral.300",
			fontFamily: "Quicksand",
			fontWeight: "400",
			fontSize: "md",
			lineHeight: "1.5",
			maxWidth: "75ch",
			lg: {
				fontSize: "lg",
			},
		},
	},
	title: {
		description: "The title text style - used in headings",
		value: {
			color: "neutral.100",
			fontFamily: "League Spartan",
			lineHeight: "1.5",
		},
	},
});

export default defineConfig({
	preflight: true,
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
	exclude: [],
	theme: {
		extend: {
			textStyles,
		},
	},
	globalCss: {
		"*": {
			transition:
				"padding 0.25s ease, margin 0.25s ease, font-size 0.25s ease, width 0.25s ease, height 0.25s ease",
		},
		html: {
			scrollBehavior: "smooth",
			scrollbarWidth: "thin",
		},
		body: {
			color: "neutral.50",
			backgroundColor: "neutral.900",
		},
		p: {
			textStyle: "body",
		},
		"h1, h2, h3, h4, h5, h6": {
			textStyle: "title",
		},
		h1: {
			fontWeight: "700",
			fontSize: "4xl",
			lg: {
				fontSize: "5xl",
			},
		},
		h2: {
			fontWeight: "600",
			fontSize: "3xl",
			lg: {
				fontSize: "4xl",
			},
		},
		h3: {
			fontWeight: "500",
			fontSize: "2xl",
			lg: {
				fontSize: "3xl",
			},
		},
		h4: {
			fontWeight: "400",
			fontSize: "xl",
			lg: {
				fontSize: "2xl",
			},
		},
	},
	outdir: "styled-system",
});
