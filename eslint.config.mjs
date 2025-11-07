import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Base JS recommended config
  js.configs.recommended,

  // TypeScript recommended (flat-config ready)
  ...tseslint.configs.recommendedTypeChecked,

  // Project-specific settings
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: true, // auto-detect tsconfig.json
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { prettier },
    rules: {
      // ---- Prettier integration ----
      "prettier/prettier": "warn",
      ...prettierConfig.rules,

      // ---- Sensible tweaks ----
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
    ignores: ["dist/**", "node_modules"],
  }
);
