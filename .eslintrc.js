module.exports = {
  root: true,
  extends: [
    '@react-native-community',


    'prettier',

    'plugin:import/typescript',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'project': './tsconfig.json'
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'react-hooks',
    'react',
    'react-hooks',
    'react-native',
],
  settings: {
    'react': {
      'version': 'detect'
    },
    'import/resolver': {
      node: {
        paths: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
    },
  },
  rules: {
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'args': 'after-used',
        'argsIgnorePattern': '^_$',
        'ignoreRestSiblings': true
      }
    ],
    '@typescript-eslint/restrict-plus-operands': 'error',
    'react/prop-types': ['off'],
    'react/destructuring-assignment': ['off'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['off'],
    'import/no-unresolved': [2, { commonjs: true }],
    // TypeScript-Eslint handles shadowing
    // eslint cannot differentiate between types and values
    // they live in diffrent namespaces.
    'no-shadow': ['off'],
    '@typescript-eslint/no-shadow': ['error'],
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'prev': '*', 'next': 'function' },
      { 'blankLine': 'always', 'prev': 'function', 'next': '*' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'return' },
      { 'blankLine': 'always', 'prev': '*', 'next': 'if' },
      { 'blankLine': 'always', 'prev': 'if', 'next': '*' },
      {
        'blankLine': 'always',
        'prev': '*',
        'next': ['multiline-const', 'multiline-let']
      }
    ],
  },
};
