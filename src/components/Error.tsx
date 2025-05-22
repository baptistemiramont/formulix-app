import { type FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

type TErrorProps = {
	message: string;
};

export const Error: FunctionComponent<TErrorProps> = ({ message }) => {
	const textStyle = css({
		color: "red",
		fontWeight: "bold",
	});

	return <p className={textStyle}>{message}</p>;
};
