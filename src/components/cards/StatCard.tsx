import type { CSSProperties, FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

type TStatCardProps = {
	label: string;
	value: string | number;
	accentColor?: string;
};

export const StatCard: FunctionComponent<TStatCardProps> = ({
	label,
	value,
	accentColor,
}: TStatCardProps) => {
	const cardStyle = {
		container: css({
			position: "relative",
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "space-between",
			alignItems: "baseline",
			columnGap: 4,
			paddingY: 3,
			paddingLeft: 8,
			paddingRight: 4,
			backgroundColor: "surface",
			width: "100%",
			height: "100%",
			_before: {
				content: "\"\"",
				position: "absolute",
				left: 3,
				top: 3,
				bottom: 3,
				width: 1,
				backgroundColor: "var(--stat-accent, token(colors.accent))",
				transform: "skewX(-14deg)",
			},
		}),
		label: css({
			color: "textMuted",
			textStyle: "label",
		}),
		value: css({
			textStyle: "figure",
			fontSize: "xl",
			lg: {
				fontSize: "2xl",
			},
		}),
	};

	return (
		<li
			className={cardStyle.container}
			style={{ "--stat-accent": accentColor } as CSSProperties}
		>
			<p className={cardStyle.label}>{label}</p>
			<p className={cardStyle.value}>{value}</p>
		</li>
	);
};
