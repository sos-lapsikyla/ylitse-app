module.exports = {
  root: true,
  extends: [
    '@react-native-community',


    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',

    "plugin:import/typescript",
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
  },
};
