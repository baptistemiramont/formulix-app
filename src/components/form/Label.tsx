import { type FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

type TLabelProps = {
	id: string;
	label: string;
};

export const Label: FunctionComponent<TLabelProps> = ({ id, label }) => {
	const labelStyle = css({});

	return (
		<label className={labelStyle} htmlFor={id}>
			{label}
		</label>
	);
};
