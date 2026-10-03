import { css } from "@/../styled-system/css";

// Raw styles, extracted where they are written: an object merged elsewhere would lose the ones no other file uses

export const fieldContainer = css.raw({
	display: "grid",
	gap: 2,
});

// The frame every control of a filter panel shares, at the height of a comfortable tap
export const controlFrame = css.raw({
	height: 11,
	backgroundColor: "bg",
	borderRadius: "md",
	outlineStyle: "solid",
	outlineWidth: "1px",
	outlineColor: "line",
	outlineOffset: "-1px",
});

// The text of a field typed or picked in: iOS zooms into one under 16 px
export const fieldText = css.raw({
	fontFamily: "saira",
	fontSize: "md",
	color: "text",
});

// The pressed look of the theme switcher, shared by the filters that toggle
export const pressedStyle = css.raw({
	"&[aria-pressed=true]": {
		color: "accentText",
		backgroundColor: "surfaceMuted",
	},
});
