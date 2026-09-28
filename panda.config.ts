import { defineConfig, defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
	body: {
		description: "The body text style - used in paragraphs",
		value: {
			fontFamily: "saira",
			fontWeight: "400",
			fontSize: "md",
			lineHeight: "1.5",
			lg: {
				fontSize: "lg",
			},
		},
	},
	label: {
		description: "The label text style - small caps used in forms and captions",
		value: {
			fontFamily: "saira",
			fontWeight: "600",
			fontSize: "xs",
			lineHeight: "1.5",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			lg: {
				fontSize: "sm",
			},
		},
	},
	title: {
		description: "The title text style - used in headings",
		value: {
			fontFamily: "saira",
			fontStretch: "125%",
			fontWeight: "800",
			lineHeight: "1.1",
		},
	},
	figure: {
		description: "The figure text style - used for stats and numbers",
		value: {
			fontFamily: "saira",
			fontStretch: "125%",
			fontWeight: "800",
			lineHeight: "1.1",
			fontVariantNumeric: "tabular-nums",
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
					f1Red: { value: "#E10600" },
					carbon: { value: "#15151E" },
					carbonRaised: { value: "#2E2E3A" },
					chalk: { value: "#F2F2F4" },
					smoke: { value: "#A1A1B0" },
				},
				fonts: {
					saira: {
						value: "\"Saira\", \"Helvetica Neue\", Arial, sans-serif",
					},
				},
			},
			semanticTokens: {
				colors: {
					bg: { value: "#F2F2F4" },
					surface: { value: "#FFFFFF" },
					surfaceMuted: { value: "#E6E6EB" },
					line: { value: "#D6D6DE" },
					text: { value: "#15151E" },
					textMuted: { value: "#5A5A69" },
					accent: { value: "{colors.f1Red}" },
					accentHover: { value: "#B80500" },
					accentText: { value: "#C80500" },
					plate: { value: "#FFFFFF" },
				},
			},
			keyframes: {
				startLight: {
					"0%": {
						backgroundColor: "token(colors.carbonRaised)",
						boxShadow: "none",
					},
					"1%, 72%": {
						backgroundColor: "token(colors.f1Red)",
						boxShadow: "0 0 12px token(colors.f1Red)",
					},
					"73%, 100%": {
						backgroundColor: "token(colors.carbonRaised)",
						boxShadow: "none",
					},
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
			color: "text",
			backgroundColor: "bg",
			fontFamily: "saira",
		},
		p: {
			color: "text",
			maxWidth: "75ch",
			textWrap: "pretty",
			textStyle: "body",
		},
		label: {
			color: "textMuted",
			textStyle: "label",
		},
		"h1, h2, h3, h4, h5, h6": {
			color: "text",
			textWrap: "balance",
			textStyle: "title",
		},
		h1: {
			fontSize: "4xl",
			lg: {
				fontSize: "5xl",
			},
		},
		h2: {
			fontSize: "3xl",
			lg: {
				fontSize: "4xl",
			},
		},
		h3: {
			fontWeight: "700",
			fontSize: "2xl",
			lg: {
				fontSize: "3xl",
			},
		},
		h4: {
			fontWeight: "600",
			fontSize: "xl",
			lg: {
				fontSize: "2xl",
			},
		},
		select: {
			fontFamily: "saira",
			padding: "2",
			borderRadius: "md",
			outlineStyle: "solid",
			outlineWidth: "1px",
			outlineColor: "line",
			outlineOffset: "-1px",
			color: "text",
			backgroundColor: "surface",
			cursor: "pointer",
		},
		":focus-visible": {
			outlineStyle: "solid",
			outlineWidth: "2px",
			outlineColor: "accent",
			outlineOffset: "2px",
		},
	},
	globalVars: {
		"--default-animation": "all 0.25s ease-in-out",
	},
	outdir: "styled-system",
});
