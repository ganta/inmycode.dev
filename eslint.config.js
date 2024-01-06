// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import typeScriptPlugin from "@typescript-eslint/eslint-plugin";
import typeScriptParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import prettier from "eslint-config-prettier";
import astroPlugin from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      // Astro
      "**/dist/**",
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },
  {
    files: ["**/*.{js,ts,tsx,astro}"],
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{ts,tsx,astro}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: ["**/*.{ts,tsx,astro}"],
    plugins: {
      "@typescript-eslint": typeScriptPlugin,
    },
    languageOptions: {
      parser: typeScriptParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      ...typeScriptPlugin.configs["eslint-recommended"].rules,
      ...typeScriptPlugin.configs.recommended.rules,
      ...typeScriptPlugin.configs["recommended-type-checked"].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          // Asynchronous React callbacks may return void.
          // https://github.com/typescript-eslint/typescript-eslint/issues/4619
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.{js,ts,tsx,astro}"],
    plugins: {
      import: importPlugin,
    },
    settings: {
      ...importPlugin.configs.typescript.settings,
      "import/parsers": {
        "@typescript-eslint/parser": [".js", ".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: true,
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/no-named-as-default": "off",
    },
  },
  {
    files: ["**/*.astro"],
    plugins: {
      astro: astroPlugin,
    },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },
  },
  prettier,
];
