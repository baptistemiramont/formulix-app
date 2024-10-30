import type { MinimalTeamType, TeamType } from "@/types/team";
import { css } from "../../../styled-system/css";
import { Link } from "@tanstack/react-router";

type Props = {
	team: TeamType | MinimalTeamType;
};

export const TeamCard = (props: Props) => {
	const {
		team: { name, id, favicon },
	} = props;

	const isCurrentTeam =
		"isCurrentTeam" in props.team ? props.team.isCurrentTeam : false;

	// Styles

	const cardStyle = {
		container: css({
			borderRadius: "md",
			backgroundColor: "neutral.200",
			transition: "var(--default-animation)",
			_hover: {
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
			<Link to="/teams/$id" params={{ id }} className={cardStyle.link}>
				<div className={cardStyle.imageContainer}>
					<img
						className={cardStyle.image}
						src={favicon}
						alt={`${name} logo`}
						width="50"
						loading="lazy"
					/>
				</div>
				<div>
					<p className={cardStyle.title}>{name}</p>
					{isCurrentTeam && <p className={cardStyle.subtitle}>Current team</p>}
				</div>
			</Link>
		</li>
	);
};
