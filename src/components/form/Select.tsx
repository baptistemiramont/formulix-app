import { type ChangeEvent, type FunctionComponent } from "react";

import { Icon } from "@iconify/react";

import { css } from "@/../styled-system/css";
import { Label } from "@/components/form/Label";
import { fieldContainer } from "@/styles/form";

type TSelectProps = {
	id: string;
	label: string;
	defaultOptionLabel: string;
	options: { label: string; value: string }[];
	changeHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
	onReset: () => void;
};

export const Select: FunctionComponent<TSelectProps> = ({
	id,
	label,
	defaultOptionLabel,
	options,
	changeHandler,
	onReset,
}) => {
	const optionsList = options.map(({ label, value }, index) => (
		<option key={index} value={value}>
			{label}
		</option>
	));

	// Styles

	const inputsContainerStyle = {
		display: "flex",
		gap: 2,
		lg: {
			gap: 3,
		},
	};

	const resetButtonStyle = {
		cursor: "pointer",
		padding: 2,
		outlineWidth: 2,
		outlineOffset: "-2px",
		outlineColor: "neutral.200",
		outlineStyle: "solid",
		borderRadius: "md",
	};

	return (
		<div className={css(fieldContainer)}>
			<Label id={id} label={label} />
			<div className={css(inputsContainerStyle)}>
				<select
					id={id}
					defaultValue=""
					onChange={changeHandler}
					className={css({ width: "full" })}
				>
					<option value="">{defaultOptionLabel}</option>
					{optionsList}
				</select>
				<button
					onClick={onReset}
					type="reset"
					title="Reset"
					className={css(resetButtonStyle)}
				>
					<Icon icon="mdi:refresh" />
				</button>
			</div>
		</div>
	);
};
