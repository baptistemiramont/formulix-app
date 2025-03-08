import React from "react";
// Styling
import { css } from "@/../styled-system/css";

type Props = {
	id: string;
	label: string;
};

export const Label: React.FC<Props> = ({ id, label }) => {
	const labelStyle = css({});

	return (
		<label className={labelStyle} htmlFor={id}>
			{label}
		</label>
	);
};
