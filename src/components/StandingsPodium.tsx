import { Icon } from "@iconify/react";
import { Link } from "@tanstack/react-router";
import type { CSSProperties, FunctionComponent, ReactNode } from "react";

import { css, cx } from "@/../styled-system/css";
import type { TStandingsRow } from "@/components/StandingsList";
import { formatWins } from "@/utils/standings";

type TStandingsPodiumProps = {
	// The first three, in the order the championship ranks them
	rows: TStandingsRow[];
	// What the leader of a season over won
	titleLabel: string;
};

// Seen from the front: the winner in the middle, the second on the left, the third on the right
const PLACES = [
	{ column: 2, step: css({ height: 24, lg: { height: 36 } }) },
	{ column: 1, step: css({ height: 16, lg: { height: 28 } }) },
	{ column: 3, step: css({ height: 12, lg: { height: 20 } }) },
];

const standingsPodiumStyle = {
	podium: css({
		display: "grid",
		gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
		alignItems: "end",
		gap: 2,
		width: "full",
		maxWidth: "2xl",
		marginX: "auto",
		sm: {
			gap: 4,
		},
	}),
	place: css({
		"--podium-accent": "var(--podium-team-color, token(colors.line))",
		gridRow: 1,
	}),
	content: css({
		display: "grid",
		gridTemplateColumns: "minmax(0, 1fr)",
		justifyItems: "center",
		gap: 2,
		textAlign: "center",
		transition: "var(--default-animation)",
		_hover: {
			"--podium-accent": "var(--podium-team-color, token(colors.accent))",
		},
	}),
	imageContainer: css({
		display: "grid",
		width: "80%",
		overflow: "hidden",
		lg: {
			width: "60%",
		},
	}),
	avatarContainer: css({
		placeItems: "end center",
		aspectRatio: "1",
		backgroundImage:
			"linear-gradient(to top, color-mix(in srgb, var(--podium-accent) 28%, transparent), transparent 75%)",
	}),
	logoContainer: css({
		placeItems: "center",
		aspectRatio: "16 / 10",
		padding: 2,
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
		justifyItems: "center",
		gap: 0.5,
	}),
	name: css({
		fontSize: "sm",
		fontWeight: 700,
		fontStretch: "112%",
		lineHeight: 1.2,
		// A name longer than the place, on the narrowest screens, wraps instead of spilling out
		overflowWrap: "anywhere",
		sm: {
			fontSize: "md",
		},
		lg: {
			fontSize: "lg",
		},
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
			backgroundColor: "var(--podium-accent)",
			transform: "skewX(-20deg)",
		},
	}),
	// Inline, the trophy stays with its words when they wrap in a narrow place
	title: css({
		color: "accentText",
		textStyle: "label",
		"& svg": {
			display: "inline",
			marginRight: 1,
			verticalAlign: "-0.125em",
		},
	}),
	// Stacked on a phone, as every place has room for it, on one line from a desktop width
	score: css({
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		lg: {
			flexDirection: "row",
			alignItems: "baseline",
			columnGap: 2,
		},
	}),
	step: css({
		display: "grid",
		justifyItems: "center",
		alignContent: "start",
		width: "full",
		paddingTop: 2,
		backgroundColor: "surface",
		borderTopWidth: "3px",
		borderColor: "var(--podium-accent)",
		borderTopRadius: "md",
		transition: "var(--default-animation)",
	}),
	position: css({
		textStyle: "figure",
		fontSize: "2xl",
		lg: {
			fontSize: "4xl",
		},
	}),
	points: css({
		textStyle: "figure",
		fontSize: "md",
		whiteSpace: "nowrap",
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

export const StandingsPodium: FunctionComponent<TStandingsPodiumProps> = ({
	rows,
	titleLabel,
}) => {
	const places = rows.map((row, index) => {
		const {
			key,
			position,
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
		const { column, step } = PLACES[index];

		const placeContent: ReactNode = (
			<>
				<span
					className={cx(
						standingsPodiumStyle.imageContainer,
						imageType === "logo"
							? standingsPodiumStyle.logoContainer
							: standingsPodiumStyle.avatarContainer
					)}
				>
					<img
						className={cx(
							standingsPodiumStyle.image,
							imageType === "photo" && standingsPodiumStyle.photo
						)}
						src={image}
						alt={imageAlt}
						width="120"
						height="120"
					/>
				</span>
				<span className={standingsPodiumStyle.identity}>
					<span className={standingsPodiumStyle.name}>{name}</span>
					{teamName && (
						<span className={standingsPodiumStyle.team}>
							{teamName}
						</span>
					)}
					{isTitle && (
						<span className={standingsPodiumStyle.title}>
							<Icon icon="mdi:trophy" />
							{titleLabel}
						</span>
					)}
					<span className={standingsPodiumStyle.score}>
						<span className={standingsPodiumStyle.points}>
							{points}{" "}
							<span className={standingsPodiumStyle.pointsUnit}>
								pts
							</span>
						</span>
						<span className={standingsPodiumStyle.wins}>
							{formatWins(wins)}
						</span>
					</span>
				</span>
				{/* The step only bears the place: its height tells the order at a glance */}
				<span className={cx(standingsPodiumStyle.step, step)}>
					<span className={standingsPodiumStyle.position}>
						{position}
					</span>
				</span>
			</>
		);

		return (
			<li
				key={key}
				className={standingsPodiumStyle.place}
				style={
					{
						gridColumn: column,
						"--podium-team-color": accentColor,
					} as CSSProperties
				}
			>
				{linkPath && linkParams ? (
					<Link
						to={linkPath}
						params={linkParams}
						className={standingsPodiumStyle.content}
					>
						{placeContent}
					</Link>
				) : (
					<div className={standingsPodiumStyle.content}>
						{placeContent}
					</div>
				)}
			</li>
		);
	});

	return (
		<ol aria-label="Top three" className={standingsPodiumStyle.podium}>
			{places}
		</ol>
	);
};
