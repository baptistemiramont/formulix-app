import type { TeamType } from "@/types/team";
import { css } from "../../../styled-system/css";

type Props = {
	team: TeamType;
};

export const TeamCard = (props: Props) => {
	const { team } = props;

	const cardStyle = {
		container: css({
			padding: 4,
		}),
		title: css({
			fontSize: "lg",
			fontWeight: "bold",
		}),
	};

	return (
		<li className={cardStyle.container}>
			<p className={cardStyle.title}>{team.name}</p>
			<p>{team.fullName}</p>
		</li>
	);
};
