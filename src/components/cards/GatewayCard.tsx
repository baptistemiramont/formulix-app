import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { formatCount } from "@/utils/record";

type TGatewayCardProps = {
	title: string;
	icon: string;
	path: string;
	// Null while the totals load, or when they cannot: the card still leads to its list
	total: number | null;
	totalLabel: string;
	details: string[];
};

const gatewayCardStyle = {
	container: css({
		backgroundColor: "surface",
		borderTopWidth: "2px",
		borderRightWidth: "2px",
		borderColor: "line",
		borderTopRightRadius: "2xl",
		transition: "var(--default-animation)",
		_hover: {
			borderColor: "accent",
			transform: "translateY(-4px)",
		},
	}),
	link: css({
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		gridTemplateRows: "auto 1fr auto",
		columnGap: 4,
		rowGap: 3,
		height: "100%",
		padding: 4,
		lg: {
			padding: 6,
		},
	}),
	title: css({
		alignSelf: "center",
		fontSize: "xl",
		lg: {
			fontSize: "2xl",
		},
	}),
	icon: css({
		color: "accentText",
		fontSize: "3xl",
	}),
	total: css({
		gridColumn: "1 / -1",
		display: "grid",
	}),
	totalValue: css({
		textStyle: "figure",
		fontSize: "4xl",
		lg: {
			fontSize: "5xl",
		},
	}),
	totalLabel: css({
		color: "textMuted",
		textStyle: "label",
	}),
	details: css({
		display: "grid",
		gap: 1,
		color: "textMuted",
		fontSize: "sm",
	}),
	arrow: css({
		alignSelf: "end",
		color: "textMuted",
		fontSize: "2xl",
		transition: "var(--default-animation)",
		_groupHover: {
			color: "accentText",
			transform: "translateX(4px)",
		},
	}),
};

export const GatewayCard: FunctionComponent<TGatewayCardProps> = ({
	title,
	icon,
	path,
	total,
	totalLabel,
	details,
}) => (
	<li className={gatewayCardStyle.container}>
		<Link to={path} className={`group ${gatewayCardStyle.link}`}>
			<h3 className={gatewayCardStyle.title}>{title}</h3>
			<Icon icon={icon} className={gatewayCardStyle.icon} />
			<p className={gatewayCardStyle.total}>
				{total !== null && (
					<span className={gatewayCardStyle.totalValue}>
						{formatCount(total)}
					</span>
				)}
				<span className={gatewayCardStyle.totalLabel}>{totalLabel}</span>
			</p>
			<ul className={gatewayCardStyle.details}>
				{details.map((detail) => (
					<li key={detail}>{detail}</li>
				))}
			</ul>
			<Icon icon="mdi:arrow-right" className={gatewayCardStyle.arrow} />
		</Link>
	</li>
);
