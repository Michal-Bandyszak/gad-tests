// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPlaywright from 'eslint-plugin-playwright';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPlaywright.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: '.',
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'playwright/no-skipped-test': 'warn',
      'playwright/valid-title': 'error',
      'playwright/no-nested-step': 'off',
    },
    settings: {
      playwright: {
        globalAliases: {
          test: ['setup'],
        },
      },
    },
  }
);
