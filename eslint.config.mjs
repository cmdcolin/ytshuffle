import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import react from 'eslint-plugin-react'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-type-checked',
      'plugin:@typescript-eslint/stylistic-type-checked',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:unicorn/recommended',
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      react: fixupPluginRules(react),
      'react-refresh': reactRefresh,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-useless-undefined': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react-refresh/only-export-components': 'warn',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      curly: 'error',
      'no-extra-semi': 'off',
    },
  },
]
