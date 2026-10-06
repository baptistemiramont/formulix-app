import { Icon } from "@iconify/react";
import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { useIsOnline } from "@/hooks/useIsOnline";

const bannerStyle = {
	banner: css({
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		paddingY: 2,
		paddingX: 4,
		color: "chalk",
		textStyle: "label",
		textAlign: "center",
		backgroundColor: "carbon",
	}),
	icon: css({
		flexShrink: 0,
		fontSize: 16,
	}),
};

// Kept in the page while online, for screen readers to announce the connection lost
export const OfflineBanner: FunctionComponent = () => {
	const isOnline = useIsOnline();

	return (
		<div role="status">
			{!isOnline && (
				<p className={bannerStyle.banner}>
					<Icon icon="mdi:cloud-off-outline" className={bannerStyle.icon} />
					Offline: showing what this device kept
				</p>
			)}
		</div>
	);
};
