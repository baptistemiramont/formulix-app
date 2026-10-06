import { type FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { useIsOnline } from "@/hooks/useIsOnline";
import { OFFLINE_MESSAGES } from "@/utils/offline";

type TErrorProps = {
	message: string;
	// Shown instead without a connection
	offlineMessage?: string;
};

export const Error: FunctionComponent<TErrorProps> = ({
	message,
	offlineMessage = OFFLINE_MESSAGES.PAGE,
}) => {
	const isOnline = useIsOnline();

	const textStyle = css({
		color: "accentText",
		fontWeight: "bold",
	});

	return <p className={textStyle}>{isOnline ? message : offlineMessage}</p>;
};
