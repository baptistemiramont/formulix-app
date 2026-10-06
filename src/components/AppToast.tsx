import { type FunctionComponent, type ReactNode, useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import { useRegisterSW } from "virtual:pwa-register/react";

import { css } from "@/../styled-system/css";
import { HapticButton } from "@/components/HapticButton";

// An installed app may stay open for days: it looks for a new version every hour
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

const OFFLINE_READY_DURATION_MS = 6000;

type TAppToastProps = {
	// True once the first Offline copy is saved
	isOfflineReady: boolean;
};

const toastStyle = {
	region: css({
		position: "fixed",
		zIndex: 20,
		insetX: 4,
		// Above the fixed tab bar, plus what it grows by above the iPhone home indicator
		bottom: "calc(81px + max(0px, env(safe-area-inset-bottom) - token(spacing.3)) + token(spacing.3))",
		display: "grid",
		justifyItems: "center",
		pointerEvents: "none",
		lg: {
			left: "auto",
			right: 8,
			bottom: 8,
		},
	}),
	toast: css({
		display: "flex",
		alignItems: "center",
		gap: 3,
		maxWidth: "26rem",
		paddingY: 2,
		paddingLeft: 4,
		paddingRight: 2,
		color: "chalk",
		backgroundColor: "carbon",
		borderRadius: "md",
		boxShadow: "lg",
		pointerEvents: "auto",
	}),
	icon: css({
		flexShrink: 0,
		fontSize: 20,
	}),
	text: css({
		color: "inherit",
		fontSize: "sm",
		lineHeight: 1.4,
	}),
	action: css({
		flexShrink: 0,
		paddingY: 1.5,
		paddingX: 3,
		color: "chalk",
		textStyle: "label",
		backgroundColor: "accent",
		borderRadius: "sm",
		cursor: "pointer",
		transition: "var(--default-animation)",
		_hover: {
			backgroundColor: "accentHover",
		},
	}),
	close: css({
		display: "grid",
		placeItems: "center",
		flexShrink: 0,
		width: 8,
		height: 8,
		color: "smoke",
		borderRadius: "sm",
		cursor: "pointer",
		_hover: {
			color: "chalk",
		},
	}),
};

// A new version waiting for a reload, or the first Offline copy just saved
export const AppToast: FunctionComponent<TAppToastProps> = ({
	isOfflineReady,
}) => {
	const {
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW(_swUrl, registration) {
			if (!registration) return;

			setInterval(() => {
				if (navigator.onLine) {
					registration.update().catch(() => undefined);
				}
			}, UPDATE_CHECK_INTERVAL_MS);
		},
	});
	const [isOfflineReadyClosed, setIsOfflineReadyClosed] = useState(false);

	useEffect(() => {
		if (!isOfflineReady) return;

		const timeout = setTimeout(
			() => setIsOfflineReadyClosed(true),
			OFFLINE_READY_DURATION_MS
		);

		return () => clearTimeout(timeout);
	}, [isOfflineReady]);

	function reload(): void {
		// Once the new version controls the page: the plugin only reloads it when a version controlled it from its opening
		navigator.serviceWorker.addEventListener(
			"controllerchange",
			() => window.location.reload(),
			{ once: true }
		);
		updateServiceWorker(true);
	}

	let toast: ReactNode = null;

	if (needRefresh) {
		toast = (
			<div className={toastStyle.toast}>
				<Icon icon="mdi:refresh" className={toastStyle.icon} />
				<p className={toastStyle.text}>New version available</p>
				<HapticButton
					type="button"
					onClick={reload}
					className={toastStyle.action}
				>
					Reload
				</HapticButton>
				<button
					type="button"
					onClick={() => setNeedRefresh(false)}
					className={toastStyle.close}
					aria-label="Later"
					title="Later"
				>
					<Icon icon="mdi:close" />
				</button>
			</div>
		);
	} else if (isOfflineReady && !isOfflineReadyClosed) {
		toast = (
			<div className={toastStyle.toast}>
				<Icon icon="mdi:cloud-check-outline" className={toastStyle.icon} />
				<p className={toastStyle.text}>
					Formulix now works offline
				</p>
				<button
					type="button"
					onClick={() => setIsOfflineReadyClosed(true)}
					className={toastStyle.close}
					aria-label="Close"
					title="Close"
				>
					<Icon icon="mdi:close" />
				</button>
			</div>
		);
	}

	return (
		<div role="status" className={toastStyle.region}>
			{toast}
		</div>
	);
};
