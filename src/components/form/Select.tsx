import { type ChangeEvent, type FunctionComponent } from "react";

import { css } from "@/../styled-system/css";
import { Label } from "@/components/form/Label";
import { fieldContainer } from "@/styles/form";

type TSelectProps = {
	id: string;
	label: string;
	defaultOptionLabel: string;
	options: { label: string; value: string }[];
	changeHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
};

export const Select: FunctionComponent<TSelectProps> = ({
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
