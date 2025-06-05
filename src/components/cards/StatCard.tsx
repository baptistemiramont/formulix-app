import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

type TStatCardProps = {
	label: string;
	value: string | number;
};

export const StatCard: FunctionComponent<TStatCardProps> = ({
	label,
	value,
}: TStatCardProps) => {
	const cardStyle = {
		container: css({
			display: "grid",
			padding: 2,
			placeContent: "center",
			borderRadius: "md",
			backgroundColor: "neutral.200",
			textAlign: "center",
			width: "100%",
			height: "100%",
		}),
		label: css({
			fontWeight: "bold",
		}),
	};

	return (
		<li className={cardStyle.container}>
			<p className={cardStyle.label}>{label}</p>
			<p>{value}</p>
		</li>
	);
};
