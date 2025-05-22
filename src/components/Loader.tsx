import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

export const Loader: FunctionComponent = () => {
	const loaderStyles = {
		container: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			position: "relative",
			overflow: "hidden",
			width: "100%",
		},
		wheel: {
			padding: 8,
			fontSize: "2rem",
			animation: "spin 1.5s linear infinite",
			position: "relative",
		},
	};

	return (
		<div className={css(loaderStyles.container)}>
			<p className={css(loaderStyles.wheel)}>🛞</p>
		</div>
	);
};
