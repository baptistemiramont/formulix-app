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
			registerType: "autoUpdate",
			injectRegister: "auto",
			pwaAssets: {
				disabled: false,
				config: true,
				injectThemeColor: false,
			},
			manifest: {
				name: "Formulix",
				short_name: "Formulix",
				description:
					"Formulix: Dive into F1 history and present ! Explore detailed profiles of teams and drivers from both the current season and past years, all in one app.",
				theme_color: "#15151E",
				background_color: "#15151E",
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,ico,png,woff2}"],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
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
