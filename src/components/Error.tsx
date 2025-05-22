import React from "react";

import { css } from "@/../styled-system/css";

type Props = {
	message: string;
};

export const Error: React.FC<Props> = ({ message }) => {
	const textStyle = css({
		color: "red",
		fontWeight: "bold",
	});

	return <p className={textStyle}>{message}</p>;
};
