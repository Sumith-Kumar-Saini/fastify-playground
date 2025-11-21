import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
  // Base JS recommended config
  js.configs.recommended,

  // TypeScript recommended (flat-config ready)
  ...tseslint.configs.recommendedTypeChecked,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.eslint.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { prettier },
    rules: {
      // ---- Prettier integration ----
      'prettier/prettier': 'warn',
      ...prettierConfig.rules,

      // ---- Sensible tweaks ----
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',

      // ---- Disable strict 'any' rules ----
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off', // optional, avoids related warnings
      '@typescript-eslint/no-unsafe-call': 'off', // optional, avoids req.startTime() warnings
    },
    ignores: ['dist/**', 'node_modules'],
  },
);
