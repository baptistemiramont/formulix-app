import { css } from "@/../styled-system/css";

// A hint below the button a tap leaves it on, lined up with its right edge
export const hintBubble = css.raw({
	position: "absolute",
	zIndex: 20,
	top: "calc(100% + token(spacing.2))",
	right: 0,
	width: "max-content",
	maxWidth: "16rem",
	paddingY: 2,
	paddingX: 3,
	color: "text",
	fontSize: "sm",
	lineHeight: 1.4,
	backgroundColor: "surface",
	borderWidth: "1px",
	borderColor: "line",
	borderRadius: "md",
	boxShadow: "lg",
});

// Kept in the page while empty, for screen readers to announce the next hint
export const hintStatus = css.raw({
	srOnly: true,
});
