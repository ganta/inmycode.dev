import path from "node:path";
import { fileURLToPath } from "node:url";

import js from "@eslint/js";
import typeScriptPlugin from "@typescript-eslint/eslint-plugin";
import typeScriptParser from "@typescript-eslint/parser";
import astroParser from "astro-eslint-parser";
import prettierConfig from "eslint-config-prettier";
import astroPlugin from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";

/** @typedef {import("eslint").Linter.FlatConfig} FlatConfig */
/** @typedef {import("eslint").Linter.ParserModule} ParserModule */
/** @typedef {import("eslint").ESLint.Plugin} Plugin */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type FlatConfig */
const reactConfig = {
  files: ["**/*.{ts,tsx,astro}"],
  plugins: {
    react: /** @type Plugin */ reactPlugin,
    "react-hooks": reactHooksPlugin,
    "jsx-a11y": jsxA11yPlugin,
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
    ...jsxA11yPlugin.configs.recommended.rules,
    // Disable rules that are no longer needed in React v17.0 or later.
    // https://ja.legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#eslint
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
  },
};

/** @type FlatConfig */
const typeScriptConfig = {
  files: ["**/*.{ts,tsx,astro}"],
  plugins: {
    "@typescript-eslint": /** @type Plugin */ typeScriptPlugin,
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
    import: /** @type Plugin */ importPlugin,
    "unused-imports": unusedImportsPlugin,
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
          orderImportKind: "asc",
        },
        warnOnUnassignedImports: true,
      },
    ],
    "import/no-named-as-default": "off",
    "unused-imports/no-unused-imports": "error",
  },
};

/** @type FlatConfig */
const astroConfig = {
  files: ["**/*.astro"],
  plugins: {
    astro: /** @type Plugin */ astroPlugin,
  },
  languageOptions: {
    parser: /** @type ParserModule */ astroParser,
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
  },
  {
    files: ["src/"],
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
