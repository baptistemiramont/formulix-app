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
			display: "flex",
			alignItems: "center",
			height: "100%",
			gap: 4,
			lg: {
				flexDirection: "column",
			},
		}),
		image: css({
			minWidth: 50,
			lg: {
				width: "auto",
				maxWidth: 150,
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
			<Link to="/teams/$id" params={{ id }} className={cardStyle.link}>
				<div>
					<img
						className={cardStyle.image}
						src={avatar}
						alt={`${firstName} ${lastName}'s avatar`}
						width="50"
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
