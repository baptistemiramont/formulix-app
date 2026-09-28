import type { FunctionComponent } from "react";

import { css } from "@/../styled-system/css";

const START_LIGHTS = 5;

export const Loader: FunctionComponent = () => {
	const loaderStyles = {
		container: css({
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			width: "100%",
			padding: 8,
		}),
		lights: css({
			display: "flex",
			gap: 2,
			paddingY: 2,
			paddingX: 3,
			backgroundColor: "carbon",
			borderRadius: "lg",
		}),
		light: css({
			width: 5,
			height: 5,
			borderRadius: "full",
			backgroundColor: "carbonRaised",
			animation: "startLight 3s infinite",
			_motionReduce: {
				animation: "none",
				backgroundColor: "f1Red",
			},
		}),
	};

	return (
		<div className={loaderStyles.container} role="status" aria-label="Loading">
			<div className={loaderStyles.lights}>
				{Array.from({ length: START_LIGHTS }, (_, index) => (
					<span
						key={index}
						className={loaderStyles.light}
						style={{ animationDelay: `${index * 0.4}s` }}
					/>
				))}
			</div>
		</div>
	);
};
