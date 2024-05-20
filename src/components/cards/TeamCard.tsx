import type { TeamType } from "@/types/team";
import { css } from "../../../styled-system/css";
import { Link } from "@tanstack/react-router";

type Props = {
	team: TeamType;
};

export const TeamCard = (props: Props) => {
	const {
		team: { name, fullName, id, favicon },
	} = props;

	const cardStyle = {
		container: css({
			padding: 4,
			display: "flex",
			alignItems: "center",
			gap: 4,
			borderRadius: "md",
			backgroundColor: "neutral.800",
		}),
		title: css({
			fontSize: "lg",
			fontWeight: "bold",
		}),
		subtitle: css({
			fontSize: "sm",
		}),
	};

	return (
		<Link to="/teams/$id" params={{ id }} className={cardStyle.container}>
			<div>
				<img src={favicon} alt={`${name} logo`} width="50" />
			</div>
			<div>
				<p className={cardStyle.title}>{name}</p>
				<p className={cardStyle.subtitle}>{fullName}</p>
			</div>
		</Link>
	);
};
