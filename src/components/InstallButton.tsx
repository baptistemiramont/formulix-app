import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";
import { useHint } from "@/hooks/useHint";
import { useInstall } from "@/hooks/useInstall";
import { hintBubble, hintStatus } from "@/styles/hint";
import { promptInstall } from "@/utils/install";

const INSTALL_LABEL = "Install Formulix";

const IOS_HINT =
	"Tap Share, then Add to Home Screen: Formulix opens like an app, offline too.";

export const InstallButton: FunctionComponent = () => {
	const state = useInstall();
	const [hint, setHint] = useHint();

	const installStyle = {
		container: css({
			position: "relative",
			display: "inline-flex",
			padding: 1,
			backgroundColor: "surface",
			borderWidth: "1px",
			borderColor: "line",
			borderRadius: "md",
		}),
		button: css({
			display: "grid",
			placeItems: "center",
			width: 8,
			height: 8,
			color: "textMuted",
			borderRadius: "sm",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "text",
			},
		}),
		icon: css({
			fontSize: 18,
		}),
		hint: css(hintBubble),
		status: css(hintStatus),
	};

	if (state === "unavailable") return null;

	function handleClick(): void {
		if (state === "ios") {
			setHint(IOS_HINT);
			return;
		}

		promptInstall();
	}

	return (
		<div className={installStyle.container}>
			<HapticButton
				type="button"
				onClick={handleClick}
				className={installStyle.button}
				aria-label={INSTALL_LABEL}
				title={INSTALL_LABEL}
			>
				<Icon icon="mdi:cellphone-arrow-down" className={installStyle.icon} />
			</HapticButton>
			<p role="status" className={hint ? installStyle.hint : installStyle.status}>
				{hint}
			</p>
		</div>
	);
};
