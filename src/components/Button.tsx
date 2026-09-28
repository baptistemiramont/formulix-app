import React, { type FunctionComponent } from "react";

import { Link } from "@tanstack/react-router";

import { css } from "@/../styled-system/css";

type TButtonProps = {
	label: string;
	path: string;
	variant?: "primary" | "secondary";
};

export const Button: FunctionComponent<TButtonProps> = ({
	label,
	path,
	variant = "primary",
}) => {
	const buttonStyle = css(
		{
			width: "fit-content",
			display: "flex",
			paddingY: 2.5,
			paddingX: 8,
			color: "white",
			backgroundColor: "accent",
			clipPath:
				"polygon(0.75rem 0, 100% 0, calc(100% - 0.75rem) 100%, 0 100%)",
			fontSize: "sm",
			fontWeight: 700,
			fontStretch: "112%",
			letterSpacing: "0.08em",
			textTransform: "uppercase",
			transition: "var(--default-animation)",
			_hover: {
				backgroundColor: "accentHover",
			},
			_focusVisible: {
				outline: "none",
				textDecoration: "underline",
				textUnderlineOffset: "4px",
			},
			lg: {
				fontSize: "md",
			},
		},
		variant === "secondary" && {
			color: "bg",
			backgroundColor: "text",
			_hover: {
				color: "white",
				backgroundColor: "accent",
			},
		}
	);

	return (
		<Link to={path} className={buttonStyle}>
			{label}
		</Link>
	);
};
