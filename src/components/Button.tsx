import React from "react";
import { Link } from "@tanstack/react-router";
import { css } from "@/../styled-system/css";

type Props = {
	label: string;
	path: string;
};

export const Button: React.FC<Props> = ({ label, path }) => {
	const buttonStyle = css({
		width: "fit-content",
		display: "flex",
		paddingY: 2,
		paddingX: 8,
		color: "neutral.50",
		backgroundColor: "primary",
		borderRadius: "md",
		fontSize: "md",
		transition: "var(--default-animation)",
		_hover: {
			backgroundColor: "primary10",
		},
		lg: {
			fontSize: "lg",
		},
	});

	return (
		<Link to={path} className={buttonStyle}>
			{label}
		</Link>
	);
};
