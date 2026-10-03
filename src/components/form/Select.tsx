import { type ChangeEvent, type FunctionComponent } from "react";

import { Icon } from "@iconify/react";

import { css } from "@/../styled-system/css";
import { Label } from "@/components/form/Label";
import { HapticButton } from "@/components/HapticButton";
import { controlFrame, fieldContainer, fieldText } from "@/styles/form";

type TSelectProps = {
	id: string;
	label: string;
	defaultOptionLabel: string;
	options: { label: string; value: string }[];
	value: string;
	changeHandler: (event: ChangeEvent<HTMLSelectElement>) => void;
	// A reset button beside the field, for a page without a filter panel to clear it
	onReset?: () => void;
};

export const Select: FunctionComponent<TSelectProps> = ({
	id,
	label,
	defaultOptionLabel,
	options,
	value,
	changeHandler,
	onReset,
}) => {
	const optionsList = options.map(({ label, value }, index) => (
		<option key={index} value={value}>
			{label}
		</option>
	));

	const selectStyle = {
		container: css(fieldContainer, {
			flex: "1 1 8rem",
			lg: {
				flex: "0 1 16rem",
			},
		}),
		inputs: css({
			display: "flex",
			gap: 2,
		}),
		field: css({
			position: "relative",
			flex: 1,
			minWidth: 0,
			display: "flex",
			alignItems: "center",
		}),
		select: css(controlFrame, fieldText, {
			width: "full",
			paddingLeft: 3,
			paddingRight: 9,
			textOverflow: "ellipsis",
			appearance: "none",
			cursor: "pointer",
		}),
		// The native arrow differs from one browser to the next: this one is drawn in the app's colours
		chevron: css({
			position: "absolute",
			right: 2.5,
			fontSize: 20,
			color: "textMuted",
			pointerEvents: "none",
		}),
		reset: css(controlFrame, {
			flexShrink: 0,
			display: "grid",
			placeItems: "center",
			width: 11,
			color: "textMuted",
			cursor: "pointer",
			transition: "var(--default-animation)",
			_hover: {
				color: "accentText",
			},
		}),
	};

	return (
		<div className={selectStyle.container}>
			<Label id={id} label={label} />
			<div className={selectStyle.inputs}>
				<div className={selectStyle.field}>
					<select
						id={id}
						value={value}
						onChange={changeHandler}
						className={selectStyle.select}
					>
						<option value="">{defaultOptionLabel}</option>
						{optionsList}
					</select>
					<Icon icon="mdi:chevron-down" className={selectStyle.chevron} />
				</div>
				{onReset && (
					<HapticButton
						onClick={onReset}
						type="button"
						title="Reset"
						className={selectStyle.reset}
					>
						<Icon icon="mdi:refresh" />
					</HapticButton>
				)}
			</div>
		</div>
	);
};
