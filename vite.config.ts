import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		TanStackRouterVite(),
		VitePWA({
			// The service worker is written in src/sw.ts: it keeps the API's answers and images for offline
			strategies: "injectManifest",
			srcDir: "src",
			filename: "sw.ts",
			// A new version waits for the visitor to reload, which the app offers
			registerType: "prompt",
			injectRegister: false,
			pwaAssets: {
				disabled: false,
				config: true,
				injectThemeColor: false,
			},
			manifest: {
				id: "/",
				name: "Formulix",
				short_name: "Formulix",
				description:
					"Formulix: Dive into F1 history and present ! Explore detailed profiles of teams and drivers from both the current season and past years, all in one app.",
				start_url: "/",
				scope: "/",
				display: "standalone",
				lang: "en",
				categories: ["sports", "entertainment"],
				theme_color: "#15151E",
				background_color: "#15151E",
				// On a long press of the app's icon
				shortcuts: [
					{
						name: "Standings",
						description: "The drivers' and constructors' championships",
						url: "/standings",
						icons: [{ src: "shortcuts/standings.png", sizes: "192x192", type: "image/png" }],
					},
					{
						name: "Drivers",
						description: "Every driver since 1950",
						url: "/drivers",
						icons: [{ src: "shortcuts/drivers.png", sizes: "192x192", type: "image/png" }],
					},
					{
						name: "Teams",
						description: "Every team since 1950",
						url: "/teams",
						icons: [{ src: "shortcuts/teams.png", sizes: "192x192", type: "image/png" }],
					},
					{
						name: "Circuits",
						description: "Every circuit and its winners",
						url: "/circuits",
						icons: [{ src: "shortcuts/circuits.png", sizes: "192x192", type: "image/png" }],
					},
				],
				// The richer install dialog of Chrome and Edge, on a phone and on a computer
				screenshots: [
					{
						src: "screenshots/home-narrow.webp",
						sizes: "1170x2532",
						type: "image/webp",
						form_factor: "narrow",
						label: "The next Grand Prix, the championships' leaders and the all-time records",
					},
					{
						src: "screenshots/driver-narrow.webp",
						sizes: "1170x2532",
						type: "image/webp",
						form_factor: "narrow",
						label: "A driver's figures and championship position season by season",
					},
					{
						src: "screenshots/standings-narrow.webp",
						sizes: "1170x2532",
						type: "image/webp",
						form_factor: "narrow",
						label: "The standings of every season since 1950",
					},
					{
						src: "screenshots/home-wide.webp",
						sizes: "2880x1800",
						type: "image/webp",
						form_factor: "wide",
						label: "The next Grand Prix, the championships' leaders and the all-time records",
					},
					{
						src: "screenshots/driver-wide.webp",
						sizes: "2880x1800",
						type: "image/webp",
						form_factor: "wide",
						label: "A driver's figures and championship position season by season",
					},
				],
			},
			injectManifest: {
				globPatterns: ["**/*.{js,css,html,svg,ico,png,webp,woff2}"],
				// Only the install dialog shows the screenshots; the shortcuts' icons come with the manifest's, once
				globIgnores: ["screenshots/**", "shortcuts/**"],
			},
		}),
	],
	server: {
		host: true,
		port: 1111,
	},
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
});
