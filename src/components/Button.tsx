import { Link } from "@tanstack/react-router";
import { css } from "../../styled-system/css";

type Props = {
	label: string;
	path: string;
};

export const Button = (props: Props) => {
	const buttonStyle = css({
		width: "fit-content",
		display: "flex",
		paddingY: 2,
		paddingX: 8,
		color: "neutral.50",
		backgroundColor: "primary",
		borderRadius: "md",
		fontSize: "md",
		transition: "all 0.25s ease-in-out",
		"&:hover": {
			backgroundColor: "primary10",
		},
		lg: {
			fontSize: "lg",
		},
	});

	const { label, path } = props;

	return (
		<Link to={path} className={buttonStyle}>
			{label}
		</Link>
	);
};
