import { defineConfig, defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
	body: {
		description: "The body text style - used in paragraphs",
		value: {
			color: "neutral.800",
			fontFamily: "Quicksand",
			fontWeight: "400",
			fontSize: "md",
			lineHeight: "1.5",
			maxWidth: "75ch",
			textWrap: "pretty",
			lg: {
				fontSize: "lg",
			},
		},
	},
	title: {
		description: "The title text style - used in headings",
		value: {
			color: "neutral.900",
			fontFamily: "League Spartan",
			lineHeight: "1.25",
			textWrap: "balance",
		},
	},
});

export default defineConfig({
	preflight: true,
	include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],
	exclude: [],
	theme: {
		extend: {
			tokens: {
				colors: {
					primary: { value: "#e10600 " },
				},
			},
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
			color: "neutral.800",
			backgroundColor: "neutral.50",
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
