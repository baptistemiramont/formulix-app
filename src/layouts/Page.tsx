import { css } from "../../styled-system/css";
import { Home } from "../pages/Home";
import { Header } from "./Header";

export const Page = () => {
	const mainStyle = css({
		paddingX: 4,
		sm: {
			paddingX: 8,
		},
		md: {
			paddingX: 16,
		},
		lg: {
			paddingX: 32,
		},
		xl: {
			paddingX: 64,
		},
		"2xl": {
			paddingX: 80,
		},
	});

	return (
		<>
			<Header />
			<main className={mainStyle}>
				<Home />
			</main>
		</>
	);
};
