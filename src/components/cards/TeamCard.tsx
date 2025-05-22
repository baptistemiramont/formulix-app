import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import type { MinimalTeamType, TTeam } from "@/types/team";

type TTeamCardProps = {
	team: TTeam | MinimalTeamType;
};

export const TeamCard: FunctionComponent<TTeamCardProps> = ({
	team,
}: TTeamCardProps) => {
	const { name, slug, favicon } = team;

	const isCurrentTeam = "isCurrentTeam" in team ? team.isCurrentTeam : false;

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
			<Link
				to="/teams/$teamSlug"
				params={{ teamSlug: slug }}
				className={cardStyle.link}
			>
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
					{isCurrentTeam && (
						<p className={cardStyle.subtitle}>Current team</p>
					)}
				</div>
			</Link>
		</li>
	);
};
