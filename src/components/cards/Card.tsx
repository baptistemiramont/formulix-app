import { Link } from "@tanstack/react-router";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

type TCardProps = {
	title: string;
	image: string;
	imageAlt: string;
	linkPath?: string;
	linkParams?: object;
	subtitle?: string;
};

export const Card: FunctionComponent<TCardProps> = ({
	title,
	image,
	imageAlt,
	linkPath,
	linkParams,
	subtitle,
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
		content: css({
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
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			minHeight: 100,
			maxHeight: 200,
			width: "100%",
		}),
		image: css({
			width: "100%",
			height: "auto",
			maxWidth: 200,
			minWidth: 50,
			objectFit: "contain",
			objectPosition: "center",
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

	const cardContent = (
		<>
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
				{subtitle && <p className={cardStyle.subtitle}>{subtitle}</p>}
			</div>
		</>
	);

	return (
		<li className={cardStyle.container}>
			{linkPath && linkParams ? (
				<Link
					to={linkPath}
					params={linkParams}
					className={cardStyle.content}
				>
					{cardContent}
				</Link>
			) : (
				<div className={cardStyle.content}>{cardContent}</div>
			)}
		</li>
	);
};
