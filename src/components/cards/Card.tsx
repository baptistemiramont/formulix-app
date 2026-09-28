import { Link } from "@tanstack/react-router";
import type { CSSProperties, FunctionComponent } from "react";

import { css, cx } from "@/../styled-system/css";
import { CircuitLayout } from "@/components/CircuitLayout";

type TCardProps = {
	title: string;
	image: string;
	imageAlt: string;
	imageType: "avatar" | "logo" | "flag" | "layout";
	badge?: { image: string; alt: string };
	linkPath?: string;
	linkParams?: object;
	subtitle?: string;
	accentColor?: string;
};

export const Card: FunctionComponent<TCardProps> = ({
	title,
	image,
	imageAlt,
	imageType,
	badge,
	linkPath,
	linkParams,
	subtitle,
	accentColor,
}: TCardProps) => {
	const cardStyle = {
		container: css({
			"--card-accent": "var(--card-team-color, token(colors.line))",
			backgroundColor: "surface",
			borderTopWidth: "2px",
			borderRightWidth: "2px",
			borderColor: "var(--card-accent)",
			borderTopRightRadius: "2xl",
			transition: "var(--default-animation)",
			_hover: {
				"--card-accent":
					"var(--card-team-color, token(colors.accent))",
				transform: "translateY(-4px)",
			},
		}),
		content: css({
			padding: 3,
			display: "grid",
			alignContent: "start",
			height: "100%",
			gap: 3,
			lg: {
				padding: 4,
			},
		}),
		imageContainer: css(
			{
				position: "relative",
				display: "grid",
				width: "100%",
				overflow: "hidden",
			},
			imageType === "avatar"
				? {
						placeItems: "end center",
						aspectRatio: "1",
						backgroundImage:
							"linear-gradient(to top, color-mix(in srgb, var(--card-accent) 28%, transparent), transparent 75%)",
					}
				: {
						placeItems: "center",
						aspectRatio: "16 / 10",
						padding: 3,
						backgroundColor: "plate",
						borderRadius: "sm",
					},
			// A layout is a line in the text colour: on the plate, it would vanish in the dark theme
			imageType === "layout" && {
				color: "text",
				backgroundColor: "transparent",
				_groupHover: {
					color: "accent",
				},
			}
		),
		badge: css({
			position: "absolute",
			top: 0,
			left: 0,
			width: 7,
			height: "auto",
			borderRadius: "2px",
			boxShadow: "0 0 0 1px token(colors.line)",
		}),
		image: css(
			{
				height: "auto",
				objectFit: "contain",
				objectPosition: "center",
			},
			imageType === "avatar"
				? {
						width: "88%",
					}
				: {
						width: "60%",
						maxHeight: "100%",
					},
			// A thin line keeps the white of a flag apart from the plate
			imageType === "flag" && {
				boxShadow: "0 0 0 1px token(colors.line)",
			}
		),
		title: css({
			fontSize: "md",
			fontWeight: 700,
			fontStretch: "112%",
			lineHeight: 1.2,
			lg: {
				fontSize: "lg",
			},
		}),
		subtitle: css({
			display: "flex",
			alignItems: "center",
			gap: 1.5,
			color: "textMuted",
			textStyle: "label",
			_before: {
				content: "\"\"",
				flexShrink: 0,
				width: 2,
				height: 2,
				backgroundColor: "var(--card-accent)",
				transform: "skewX(-20deg)",
			},
		}),
	};

	const cardContent = (
		<>
			<div className={cardStyle.imageContainer}>
				{imageType === "layout" ? (
					<CircuitLayout url={image} label={imageAlt} />
				) : (
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
				)}
				{badge && (
					<img
						className={cardStyle.badge}
						src={badge.image}
						alt={badge.alt}
						width="28"
						loading="lazy"
					/>
				)}
			</div>
			<div>
				<p className={cardStyle.title}>{title}</p>
				{subtitle && <p className={cardStyle.subtitle}>{subtitle}</p>}
			</div>
		</>
	);

	return (
		<li
			className={cx("group", cardStyle.container)}
			style={{ "--card-team-color": accentColor } as CSSProperties}
		>
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
