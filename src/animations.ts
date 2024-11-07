export const commonSettings = {
	duration: 1.5,
	ease: "power3.out",
	opacity: 0,
};

export const fromSettings = {
	left: {
		...commonSettings,
		x: "-100vw",
	},
	right: {
		...commonSettings,
		x: "100vw",
	},
	top: {
		...commonSettings,
		y: "-200px",
	},
	bottom: {
		...commonSettings,
		y: "200px",
	},
};

export const toSettings = {
	x: 0,
	y: 0,
	opacity: 1,
};

export const scrollOptions = {
	scrub: 1.5,
	once: true,
};
