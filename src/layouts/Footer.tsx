import { css } from "../../styled-system/css";

export const Footer = () => {
	const footerStyle = {
		container: css({
			marginBottom: "81px",
		}),
	};

	return <footer className={footerStyle.container}></footer>;
};
