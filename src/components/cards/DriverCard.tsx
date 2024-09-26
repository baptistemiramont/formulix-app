import type { DriverType } from "@/types/driver";
import { css } from "../../../styled-system/css";
import { Link } from "@tanstack/react-router";

type Props = {
	driver: DriverType;
};

export const DriverCard = (props: Props) => {
	const {
		driver: { firstName, lastName, id, avatar, team },
	} = props;

	const cardStyle = {
		container: css({
			borderRadius: "md",
			backgroundColor: "neutral.800",
			transition: "all 0.25s ease-in-out",
			"&:hover": {
				boxShadow: "0 0 25px token(colors.neutral.800)",
			},
		}),
		link: css({
			padding: 4,
			display: "grid",
			height: "100%",
			textAlign: "center",
			gap: 4,
			lg: {
				flexDirection: "column",
			},
		}),
		imageContainer: css({
			display: "grid",
			justifyContent: "center",
		}),
		image: css({
			minWidth: 50,
			maxWidth: 200,
			width: 100,
			md: {
				width: 150,
			},
			lg: {
				width: "auto",
			},
		}),
		title: css({
			fontSize: "lg",
			fontWeight: "bold",
			lg: {
				textAlign: "center",
			},
		}),
		subtitle: css({
			fontSize: "sm",
			lg: {
				textAlign: "center",
			},
		}),
	};

	return (
		<li className={cardStyle.container}>
			<Link to="/drivers/$id" params={{ id }} className={cardStyle.link}>
				<div className={cardStyle.imageContainer}>
					<img
						className={cardStyle.image}
						src={avatar}
						alt={`${firstName} ${lastName}'s avatar`}
						width="100"
						loading="lazy"
					/>
				</div>
				<div>
					<p className={cardStyle.title}>
						{firstName} {lastName}
					</p>
					<p className={cardStyle.subtitle}>{team}</p>
				</div>
			</Link>
		</li>
	);
};
