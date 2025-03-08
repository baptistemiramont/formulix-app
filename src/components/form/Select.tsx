import React from "react";
// Components
import { Label } from "@/components/form/Label";
// Styling
import { css } from "@/../styled-system/css";
import { fieldContainer } from "@/styles/form";

type Props = {
	id: string;
	label: string;
	defaultOptionLabel: string;
	options: { label: string; value: string }[];
	changeHandler: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const Select: React.FC<Props> = ({
	id,
	label,
	defaultOptionLabel,
	options,
	changeHandler,
}) => {
	const optionsList = options.map(({ label, value }, index) => (
		<option key={index} value={value}>
			{label}
		</option>
	));

	return (
		<div className={css(fieldContainer)}>
			<Label id={id} label={label} />
			<select id={id} defaultValue="" onChange={changeHandler}>
				<option value="">{defaultOptionLabel}</option>
				{optionsList}
			</select>
		</div>
	);
};
