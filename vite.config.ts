import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import * as path from "path";

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
			},
			manifest: {
				name: "Formulix",
				short_name: "Formulix",
				description:
					"Formulix: Dive into F1 history and present ! Explore detailed profiles of teams and drivers from both the current season and past years, all in one app.",
				theme_color: "#f5f5f5",
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,svg,ico,png,ttf}"],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
			},
		}),
	],
	server: {
		host: true,
	},
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
	},
});
