import {
	type ComponentProps,
	type FunctionComponent,
	type MouseEvent,
} from "react";

import { css, cx } from "@/../styled-system/css";
import { isAppleMobile, vibrate } from "@/utils/haptics";

type THapticButtonProps = ComponentProps<"button"> & {
	// False when the tap changes nothing, such as on the option already chosen
	haptic?: boolean;
};

export const HapticButton: FunctionComponent<THapticButtonProps> = ({
	haptic = true,
	className,
	onClick,
	children,
	...props
}) => {
	const hasSwitch = isAppleMobile();

	const hapticStyle = {
		button: css({
			position: "relative",
		}),
		// Covers the button: a tap toggles the switch, which Safari answers with a vibration
		overlay: css({
			position: "absolute",
			inset: 0,
			touchAction: "manipulation",
			WebkitTapHighlightColor: "transparent",
		}),
		// Never under the finger: WebKit takes a touch starting on a switch as handled, and cancels the scroll
		switch: css({
			position: "absolute",
			width: "1px",
			height: "1px",
			margin: 0,
			visibility: "hidden",
		}),
	};

	function handleClick(event: MouseEvent<HTMLButtonElement>): void {
		if (haptic) {
			vibrate();
		}

		onClick?.(event);
	}

	return (
		<button
			{...props}
			className={cx(hapticStyle.button, className)}
			onClick={handleClick}
		>
			{children}
			{/* Kept even when the tap changes nothing: a switch the tap itself removed would not vibrate */}
			{hasSwitch && (
				<label
					aria-hidden="true"
					className={hapticStyle.overlay}
					// A label canceled does not click its switch
					onClick={(event) => !haptic && event.preventDefault()}
				>
					<input
						// React 18 does not know the switch attribute Safari 17.4 added
						ref={(input) => input?.setAttribute("switch", "")}
						type="checkbox"
						tabIndex={-1}
						className={hapticStyle.switch}
						// The label clicks the switch in turn: that second click must not reach the button
						onClick={(event) => event.stopPropagation()}
					/>
				</label>
			)}
		</button>
	);
};
