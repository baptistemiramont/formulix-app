import { css } from "@/../styled-system/css";

export const cornerTitle = css.raw({
	width: "fit-content",
	paddingTop: 1.5,
	paddingRight: 4,
	borderTopWidth: "3px",
	borderRightWidth: "3px",
	borderColor: "accent",
	borderTopRightRadius: "xl",
	lg: {
		paddingTop: 2,
		paddingRight: 5,
	},
});
