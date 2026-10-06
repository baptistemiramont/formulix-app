import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import { useHint } from "@/hooks/useHint";
import { hintBubble, hintStatus } from "@/styles/hint";

type TShareButtonProps = {
	// What the page shows, such as a driver's name
	title: string;
};

const shareStyle = {
	container: css({
		position: "relative",
		display: "inline-flex",
		justifySelf: "center",
	}),
	button: css({
		display: "inline-flex",
		alignItems: "center",
		gap: 1.5,
		paddingY: 1.5,
		paddingX: 3,
		color: "textMuted",
		textStyle: "label",
		backgroundColor: "surface",
		borderWidth: "1px",
		borderColor: "line",
		borderRadius: "md",
		cursor: "pointer",
		transition: "var(--default-animation)",
		_hover: {
			color: "text",
		},
	}),
	icon: css({
		fontSize: 16,
	}),
	// Below the button, centred as it is
	hint: css(hintBubble, {
		right: "auto",
		left: "50%",
		transform: "translateX(-50%)",
	}),
	status: css(hintStatus),
};

// The share sheet of the device where there is one, the page's address copied otherwise
export const ShareButton: FunctionComponent<TShareButtonProps> = ({
	title,
}) => {
	const [hint, setHint] = useHint();

	async function handleClick(): Promise<void> {
		const url = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({ title: `${title} · Formulix`, url });
			} catch {
				// Closed without sharing
			}

			return;
		}

		try {
			await navigator.clipboard.writeText(url);
			setHint("Link copied");
		} catch {
			setHint("Copy the address of the page to share it");
		}
	}

	return (
		<div className={shareStyle.container}>
			<HapticButton
				type="button"
				onClick={handleClick}
				className={shareStyle.button}
				aria-label={`Share ${title}`}
			>
				<Icon icon="mdi:share-variant" className={shareStyle.icon} />
				Share
			</HapticButton>
			<p role="status" className={hint ? shareStyle.hint : shareStyle.status}>
				{hint}
			</p>
		</div>
	);
};
