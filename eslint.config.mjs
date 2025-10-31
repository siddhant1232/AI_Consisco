// eslint.config.js
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";

const compat = new FlatCompat();

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Ignore build artifacts
  { ignores: [".next/**", "node_modules/**"] },

  // Classic configs converted to flat format
  ...compat.extends("next/core-web-vitals", "prettier"),

  // Your custom rules/plugins
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "warn",           // or "error" if you want strict
      "react/no-unescaped-entities": "off",  // this was the rule that blocked you
    },
  },
];
