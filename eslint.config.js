import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typeScriptPlugin from "@typescript-eslint/eslint-plugin";
import typeScriptParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import prettierConfig from "eslint-config-prettier";
import astroPlugin from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";

/** @typedef {import("eslint").Linter.FlatConfig} FlatConfig */
/** @typedef {import("eslint").Linter.ParserModule} ParserModule */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type FlatConfig */
const reactConfig = {
  files: ["**/*.{ts,tsx,astro}"],
  plugins: {
    ...compat.plugins("react")[0].plugins,
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
};

/** @type FlatConfig */
const typeScriptConfig = {
  files: ["**/*.{ts,tsx,astro}"],
  plugins: {
    ...compat.plugins("@typescript-eslint")[0].plugins,
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
    ...typeScriptPlugin.configs["eslint-recommended"]["rules"],
    ...typeScriptPlugin.configs.recommended["rules"],
    ...typeScriptPlugin.configs["recommended-type-checked"]["rules"],
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
};

/** @type FlatConfig */
const importConfig = {
  files: ["**/*.{js,ts,tsx,astro}"],
  plugins: {
    ...compat.plugins("import")[0].plugins,
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
};

const astroConfig = /** @type FlatConfig */ {
  files: ["**/*.astro"],
  plugins: {
    ...compat.plugins("astro")[1].plugins,
  },
  languageOptions: {
    parser: astroParser,
    parserOptions: {
      parser: "@typescript-eslint/parser",
    },
  },
  rules: {
    ...astroPlugin.configs.recommended.rules,
    ...astroPlugin.configs["jsx-a11y-recommended"].rules,
  },
};

// noinspection JSUnusedGlobalSymbols
/** @type FlatConfig[] */
export default [
  {
    ignores: [
      // Astro
      "dist/",
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    files: ["eslint.config.js", ".prettierrc.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  reactConfig,
  typeScriptConfig,
  importConfig,
  astroConfig,
  prettierConfig,
];
