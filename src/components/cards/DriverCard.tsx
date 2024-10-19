import type { DriverType, MinimalDriverType } from "@/types/driver";
import { css } from "../../../styled-system/css";
import { Link } from "@tanstack/react-router";

type Props = {
	driver: DriverType | MinimalDriverType;
};

export const DriverCard = (props: Props) => {
	const {
		driver: { firstName, lastName, id, avatar },
	} = props;

	const team = "team" in props.driver ? props.driver.team : false;
	// Styles

	const cardStyle = {
		container: css({
			borderRadius: "md",
			backgroundColor: "neutral.200",
			transition: "all 0.25s ease-in-out",
			"&:hover": {
				boxShadow: "0 0 25px token(colors.neutral.200)",
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
				width: 200,
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
					{team && <p className={cardStyle.subtitle}>{team}</p>}
				</div>
			</Link>
		</li>
	);
};
