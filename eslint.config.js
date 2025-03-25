import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import sortImports from "eslint-plugin-simple-import-sort";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
			"simple-import-sort": sortImports,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			// React
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"react-hooks/exhaustive-deps": "error",
			"react-hooks/rules-of-hooks": "error",
			// TypeScript
			"@typescript-eslint/no-unused-vars": ["error", {
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_"
			}],
			"@typescript-eslint/explicit-function-return-type": ["error", {
				"allowExpressions": true
			}],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/no-non-null-assertion": "error",
			// General
			"quotes": ["error", "double"],
			"semi": ["error", "always"],
			"no-console": ["warn", { "allow": ["warn", "error"] }],
			"no-debugger": "error",
			"eqeqeq": ["error", "always"],
			"no-var": "error",
			"prefer-const": "error",
			"no-duplicate-imports": "error",
			"simple-import-sort/imports": ["error", {
				"groups": [
					["^react$", "^react-dom$"],
					["^@?\\w"],
					["^@/"],
					["^\\.\\.(?!/?$)", "^\\.\\./?$"],
					["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
					["^.+\\.css$"]
				]
			}],
			"sort-imports": ["error", {
				"ignoreCase": true,
				"ignoreDeclarationSort": true,
				"ignoreMemberSort": false
			}]
		},
	}
);