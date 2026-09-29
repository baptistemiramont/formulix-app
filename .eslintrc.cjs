module.exports = {
	root: true,
	env: {
		browser: true,
		es2020: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
	],
	ignorePatterns: ["dist", ".eslintrc.cjs", "styled-system"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", "simple-import-sort"],
	overrides: [
		{
			// One-off Node scripts, run by hand and not bundled: plain JavaScript, without type annotations
			files: ["scripts/**/*.js"],
			env: {
				node: true,
			},
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
				"no-console": "off",
			},
		},
		{
			// Imported as is into the generated service worker, not bundled: plain JavaScript, without type annotations
			files: ["public/**/*.js"],
			env: {
				browser: false,
				serviceworker: true,
			},
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off",
			},
		},
	],
	rules: {
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
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
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"no-debugger": "error",
		"eqeqeq": ["error", "always"],
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
};
