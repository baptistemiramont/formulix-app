import type { CSSProperties, FunctionComponent } from "react";

import { css, cx } from "@/../styled-system/css";

type TCircuitLayoutProps = {
	url: string;
	label: string;
	className?: string;
};

// The SVG only shapes the line: its colour follows the surrounding text, theme and hover included
export const CircuitLayout: FunctionComponent<TCircuitLayoutProps> = ({
	url,
	label,
	className,
}: TCircuitLayoutProps) => {
	const layoutStyle = css({
		width: "100%",
		height: "100%",
		backgroundColor: "currentColor",
		transition: "var(--default-animation)",
		maskImage: "var(--layout-url)",
		maskSize: "contain",
		maskRepeat: "no-repeat",
		maskPosition: "center",
		WebkitMaskImage: "var(--layout-url)",
		WebkitMaskSize: "contain",
		WebkitMaskRepeat: "no-repeat",
		WebkitMaskPosition: "center",
	});

	return (
		<div
			role="img"
			aria-label={label}
			className={cx(layoutStyle, className)}
			style={{ "--layout-url": `url("${url}")` } as CSSProperties}
		/>
	);
};
