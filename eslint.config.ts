import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import sortImports from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		plugins: {
			js,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"simple-import-sort": sortImports,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"react-hooks/exhaustive-deps": "error",
			"react-hooks/rules-of-hooks": "error",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{
					allowExpressions: true,
				},
			],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-non-null-assertion": "error",
			quotes: ["error", "double"],
			semi: ["error", "always"],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-debugger": "error",
			eqeqeq: ["error", "always"],
			"no-var": "error",
			"prefer-const": "error",
			"no-duplicate-imports": "error",
			"simple-import-sort/imports": [
				"error",
				{
					groups: [
						["^react$", "^react-dom$"],
						["^@?\\w"],
						["^@/"],
						["^\\.\\.(?!/?$)", "^\\.\\./?$"],
						["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
						["^.+\\.css$"],
					],
				},
			],
			"sort-imports": [
				"error",
				{
					ignoreCase: true,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
				},
			],
		},
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		languageOptions: { globals: globals.browser },
	},
	tseslint.configs.recommended,
	pluginReact.configs.flat.recommended,
]);
