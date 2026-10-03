import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import type { CSSProperties, FunctionComponent, ReactNode } from "react";

import { css, cx } from "@/../styled-system/css";
import type { TStanding } from "@/types/standing";
import {
	formatPosition,
	formatShortPosition,
	formatWins,
} from "@/utils/standings";

export type TStandingsRow = Pick<
	TStanding,
	"position" | "points" | "wins" | "isExcluded" | "isTitle"
> & {
	key: string;
	name: string;
	// The team a driver ended the season with
	teamName?: string;
	image: string;
	imageType: "avatar" | "photo" | "logo";
	imageAlt: string;
	accentColor?: string;
	linkPath?: string;
	linkParams?: object;
};

type TStandingsListProps = {
	rows: TStandingsRow[];
	// What the leader of a season over won
	titleLabel: string;
};

const standingsListStyle = {
	list: css({
		display: "grid",
		gap: 2,
	}),
	row: css({
		"--standing-accent": "var(--standing-team-color, token(colors.line))",
		backgroundColor: "surface",
		transition: "var(--default-animation)",
		_hover: {
			backgroundColor: "surfaceMuted",
		},
	}),
	content: css({
		position: "relative",
		display: "grid",
		// The narrowest screens leave the name a hundred pixels or so, as a card's title
		gridTemplateColumns: "1.75rem 2.25rem minmax(0, 1fr) auto",
		alignItems: "center",
		columnGap: 2,
		paddingY: 2,
		paddingLeft: 6,
		paddingRight: 3,
		sm: {
			gridTemplateColumns: "2rem 2.5rem minmax(0, 1fr) auto",
			columnGap: 3,
			paddingLeft: 7,
			paddingRight: 4,
		},
		lg: {
			gridTemplateColumns: "2.5rem 3rem minmax(0, 1fr) auto",
			columnGap: 4,
			paddingLeft: 8,
		},
		// The team colour, as the stats wear it
		_before: {
			content: "\"\"",
			position: "absolute",
			left: 2.5,
			top: 2,
			bottom: 2,
			width: 1,
			backgroundColor: "var(--standing-accent)",
			transform: "skewX(-14deg)",
			sm: {
				left: 3,
			},
		},
	}),
	position: css({
		textStyle: "figure",
		fontSize: "md",
		sm: {
			fontSize: "lg",
		},
		lg: {
			fontSize: "xl",
		},
	}),
	imageContainer: css({
		display: "grid",
		width: "full",
		aspectRatio: "1",
		overflow: "hidden",
	}),
	avatarContainer: css({
		placeItems: "end center",
		backgroundImage:
			"linear-gradient(to top, color-mix(in srgb, var(--standing-accent) 28%, transparent), transparent 75%)",
	}),
	logoContainer: css({
		placeItems: "center",
		padding: 1,
		backgroundColor: "plate",
		borderRadius: "sm",
	}),
	image: css({
		width: "full",
		height: "full",
		objectFit: "contain",
		objectPosition: "bottom",
	}),
	// A photo fills the frame of a cutout, cropped from the top where the face is
	photo: css({
		objectFit: "cover",
		objectPosition: "top",
	}),
	identity: css({
		display: "grid",
		gap: 0.5,
	}),
	name: css({
		fontSize: "md",
		fontWeight: 700,
		fontStretch: "112%",
		lineHeight: 1.2,
		// A name longer than the row, on the narrowest screens, wraps instead of spilling out
		overflowWrap: "anywhere",
		lg: {
			fontSize: "lg",
		},
	}),
	details: css({
		display: "flex",
		flexWrap: "wrap",
		columnGap: 3,
		rowGap: 0.5,
	}),
	team: css({
		display: "flex",
		alignItems: "center",
		gap: 1.5,
		color: "textMuted",
		textStyle: "label",
		overflowWrap: "anywhere",
		_before: {
			content: "\"\"",
			flexShrink: 0,
			width: 2,
			height: 2,
			backgroundColor: "var(--standing-accent)",
			transform: "skewX(-20deg)",
		},
	}),
	title: css({
		display: "flex",
		alignItems: "center",
		gap: 1,
		color: "accentText",
		textStyle: "label",
	}),
	score: css({
		display: "grid",
		justifyItems: "end",
		gap: 0.5,
		textAlign: "right",
	}),
	points: css({
		textStyle: "figure",
		fontSize: "md",
		whiteSpace: "nowrap",
		sm: {
			fontSize: "lg",
		},
		lg: {
			fontSize: "xl",
		},
	}),
	pointsUnit: css({
		color: "textMuted",
		textStyle: "label",
	}),
	wins: css({
		color: "textMuted",
		textStyle: "label",
		whiteSpace: "nowrap",
	}),
};

export const StandingsList: FunctionComponent<TStandingsListProps> = ({
	rows,
	titleLabel,
}) => {
	const standingsRows = rows.map((row) => {
		const {
			key,
			name,
			teamName,
			image,
			imageType,
			imageAlt,
			accentColor,
			linkPath,
			linkParams,
			isTitle,
			points,
			wins,
		} = row;

		const rowContent: ReactNode = (
			<>
				<span
					className={standingsListStyle.position}
					title={formatPosition(row)}
				>
					{formatShortPosition(row)}
				</span>
				<span
					className={cx(
						standingsListStyle.imageContainer,
						imageType === "logo"
							? standingsListStyle.logoContainer
							: standingsListStyle.avatarContainer
					)}
				>
					<img
						className={cx(
							standingsListStyle.image,
							imageType === "photo" && standingsListStyle.photo
						)}
						src={image}
						alt={imageAlt}
						width="48"
						height="48"
						loading="lazy"
					/>
				</span>
				<span className={standingsListStyle.identity}>
					<span className={standingsListStyle.name}>{name}</span>
					{(teamName || isTitle) && (
						<span className={standingsListStyle.details}>
							{teamName && (
								<span className={standingsListStyle.team}>
									{teamName}
								</span>
							)}
							{isTitle && (
								<span className={standingsListStyle.title}>
									<Icon icon="mdi:trophy" />
									{titleLabel}
								</span>
							)}
						</span>
					)}
				</span>
				<span className={standingsListStyle.score}>
					<span className={standingsListStyle.points}>
						{points}{" "}
						<span className={standingsListStyle.pointsUnit}>
							pts
						</span>
					</span>
					<span className={standingsListStyle.wins}>
						{formatWins(wins)}
					</span>
				</span>
			</>
		);

		return (
			<li
				key={key}
				className={standingsListStyle.row}
				style={
					{ "--standing-team-color": accentColor } as CSSProperties
				}
			>
				{linkPath && linkParams ? (
					<Link
						to={linkPath}
						params={linkParams}
						className={standingsListStyle.content}
					>
						{rowContent}
					</Link>
				) : (
					<div className={standingsListStyle.content}>
						{rowContent}
					</div>
				)}
			</li>
		);
	});

	return <ol className={standingsListStyle.list}>{standingsRows}</ol>;
};
