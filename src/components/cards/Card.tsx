import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

type TCardProps = {
	title: string;
	image: string;
	imageAlt: string;
	linkPath: string;
	linkParams: object;
	subtitle?: string | null;
};

export const Card: FunctionComponent<TCardProps> = ({
	title,
	image,
	imageAlt,
	linkPath,
	linkParams,
	subtitle = null,
}: TCardProps) => {
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
			<Link to={linkPath} params={linkParams} className={cardStyle.link}>
				<div className={cardStyle.imageContainer}>
					<img
						className={cardStyle.image}
						src={image}
						alt={imageAlt}
						width="50"
						loading="lazy"
						onError={(e) => {
							(e.target as HTMLImageElement).src =
								"/assets/images/default-team.png";
						}}
					/>
				</div>
				<div>
					<p className={cardStyle.title}>{title}</p>
					{subtitle && (
						<p className={cardStyle.subtitle}>{subtitle}</p>
					)}
				</div>
			</Link>
		</li>
	);
};
