import { css } from "@/../styled-system/css";

type Props = {
	label: string;
	value: string | number;
};

export const StatCard = (props: Props) => {
	const { label, value } = props;

	// Style

	const cardStyle = {
		container: css({
			display: "grid",
			padding: 2,
			placeContent: "center",
			borderRadius: "md",
			backgroundColor: "neutral.800",
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
