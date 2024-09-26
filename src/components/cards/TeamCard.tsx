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
						src={favicon}
						alt={`${name} logo`}
						width="50"
					/>
				</div>
				<div>
					<p className={cardStyle.title}>{name}</p>
					{isCurrentTeam && <p className={cardStyle.subtitle}>Current Team</p>}
				</div>
			</Link>
		</li>
	);
};
