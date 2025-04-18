import { defineConfig, defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
	body: {
		description: "The body text style - used in paragraphs",
		value: {
			fontFamily: "Quicksand",
			fontWeight: "400",
			fontSize: "md",
			lineHeight: "1.5",
			lg: {
				fontSize: "lg",
			},
		},
	},
	label: {
		description: "The label text style",
		value: {
			fontFamily: "Quicksand",
			fontWeight: "700",
			fontSize: "sm",
			lineHeight: "1.5",
			lg: {
				fontSize: "md",
			},
		},
	},
	title: {
		description: "The title text style - used in headings",
		value: {
			fontFamily: "League Spartan",
			lineHeight: "1.25",
		},
	},
	highlight: {
		description: "The highlight text style",
		value: {
			fontWeight: "700",
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
					primary: { value: "hsl(0, 65%, 51%)" },
					primary10: { value: "hsl(0, 65%, 61%)" },
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
			color: "neutral.800",
			maxWidth: "75ch",
			textWrap: "pretty",
			textStyle: "body",
		},
		label: {
			color: "neutral.800",
			textStyle: "label",
		},
		"h1, h2, h3, h4, h5, h6": {
			color: "neutral.900",
			textWrap: "balance",
			textStyle: "title",
		},
		h1: {
			fontWeight: "700",
			fontSize: "5xl",
			lg: {
				fontSize: "6xl",
			},
		},
		h2: {
			fontWeight: "700",
			fontSize: "4xl",
			lg: {
				fontSize: "5xl",
			},
		},
		h3: {
			fontWeight: "600",
			fontSize: "3xl",
			lg: {
				fontSize: "4xl",
			},
		},
		h4: {
			fontWeight: "500",
			fontSize: "2xl",
			lg: {
				fontSize: "3xl",
			},
		},
		select: {
			fontFamily: "Quicksand",
			padding: "2",
			borderRadius: "md",
			outlineStyle: "solid",
			outlineWidth: "2px",
			outlineColor: "neutral.200",
			outlineOffset: "-2px",
			backgroundColor: "neutral.50",
			cursor: "pointer",
		},
	},
	globalVars: {
		"--default-animation": "all 0.25s ease-in-out",
	},
	outdir: "styled-system",
});
