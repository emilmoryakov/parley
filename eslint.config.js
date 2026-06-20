import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
      eqeqeq: "error",
      curly: "error",
    },
  },
  {
    ignores: ["node_modules/", ".husky/"],
  },
];
