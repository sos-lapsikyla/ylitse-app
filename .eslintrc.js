module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  plugins: ['react-hooks', '@typescript-eslint/eslint-plugin'],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-use-before-define': ['off'],
    'react/prop-types': ['off'],
    'react/destructuring-assignment': ['off'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': ['off'],
    'jsx-quotes': ['error', 'prefer-double'],
    quotes: [2, 'single'],
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
      },
    ],
  },
};
