import { Link } from "@tanstack/react-router";
import type { CSSProperties, FunctionComponent } from "react";

import { css, cx } from "@/../styled-system/css";
import { CircuitLayout } from "@/components/CircuitLayout";
import { formatCount } from "@/utils/record";

export type TRecordHolder = {
	key: string;
	name: string;
	linkPath: string;
	linkParams: object;
	// Undefined for a circuit whose layout is not drawn yet
	image?: string;
	imageType: "avatar" | "photo" | "logo" | "layout";
	imageAlt: string;
};

export type TRecordCardProps = {
	label: string;
	count: number;
	holders: TRecordHolder[];
	accentColor?: string;
};

const recordCardStyle = {
	container: css({
		"--record-accent": "var(--record-team-color, token(colors.accent))",
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr) auto",
		gridTemplateAreas: "\"label images\" \"count images\" \"holders holders\"",
		alignItems: "center",
		columnGap: 4,
		rowGap: 1,
		padding: 4,
		backgroundColor: "surface",
		borderTopWidth: "3px",
		borderColor: "var(--record-accent)",
		lg: {
			padding: 5,
		},
	}),
	label: css({
		gridArea: "label",
		alignSelf: "end",
		color: "textMuted",
		textStyle: "label",
	}),
	count: css({
		gridArea: "count",
		alignSelf: "start",
		textStyle: "figure",
		fontSize: "3xl",
		lg: {
			fontSize: "4xl",
		},
	}),
	holders: css({
		gridArea: "holders",
		paddingTop: 2,
		fontWeight: 600,
		lineHeight: 1.3,
	}),
	holderLink: css({
		textDecoration: "underline",
		textDecorationColor: "var(--record-accent)",
		textUnderlineOffset: "3px",
		transition: "var(--default-animation)",
		_hover: {
			color: "accentText",
		},
	}),
	images: css({
		gridArea: "images",
		display: "flex",
		gap: 1,
	}),
	imageContainer: css({
		display: "grid",
		width: 14,
		aspectRatio: "1",
		overflow: "hidden",
		lg: {
			width: 16,
		},
	}),
	avatarContainer: css({
		placeItems: "end center",
		backgroundImage:
			"linear-gradient(to top, color-mix(in srgb, var(--record-accent) 28%, transparent), transparent 75%)",
	}),
	logoContainer: css({
		placeItems: "center",
		padding: 2,
		backgroundColor: "plate",
		borderRadius: "sm",
	}),
	layoutContainer: css({
		padding: 1,
		color: "text",
	}),
	image: css({
		width: "full",
		height: "full",
		objectFit: "contain",
		objectPosition: "bottom",
	}),
	// Cropped from the top, where the face is
	photo: css({
		objectFit: "cover",
		objectPosition: "top",
	}),
};

// A photo takes the frame of a cutout, which it fills
const IMAGE_CONTAINER_STYLES = {
	avatar: recordCardStyle.avatarContainer,
	photo: recordCardStyle.avatarContainer,
	logo: recordCardStyle.logoContainer,
	layout: recordCardStyle.layoutContainer,
};

export const RecordCard: FunctionComponent<TRecordCardProps> = ({
	label,
	count,
	holders,
	accentColor,
}) => (
	<li
		className={recordCardStyle.container}
		style={{ "--record-team-color": accentColor } as CSSProperties}
	>
		<p className={recordCardStyle.label}>{label}</p>
		<p className={recordCardStyle.count}>{formatCount(count)}</p>
		<p className={recordCardStyle.holders}>
			{holders.map(({ key, name, linkPath, linkParams }, index) => (
				<span key={key}>
					{index > 0 && (index === holders.length - 1 ? " & " : ", ")}
					<Link
						to={linkPath}
						params={linkParams}
						className={recordCardStyle.holderLink}
					>
						{name}
					</Link>
				</span>
			))}
		</p>
		{/* The names already lead there: the thumbnails do too, out of the keyboard's way */}
		<div className={recordCardStyle.images} aria-hidden="true">
			{holders
				.filter(({ image }) => image)
				.map(({ key, linkPath, linkParams, image = "", imageType, imageAlt }) => (
					<Link
						key={key}
						to={linkPath}
						params={linkParams}
						tabIndex={-1}
						className={cx(
							recordCardStyle.imageContainer,
							IMAGE_CONTAINER_STYLES[imageType]
						)}
					>
						{imageType === "layout" ? (
							<CircuitLayout url={image} label={imageAlt} />
						) : (
							<img
								className={cx(
									recordCardStyle.image,
									imageType === "photo" && recordCardStyle.photo
								)}
								src={image}
								alt={imageAlt}
								width="80"
								height="80"
								loading="lazy"
							/>
						)}
					</Link>
				))}
		</div>
	</li>
);
