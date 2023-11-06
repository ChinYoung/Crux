module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:react-hooks/recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react-native/no-inline-styles': 0,
    'react/react-in-jsx-scope': 0,
    'react/no-unstable-nested-components': 0,
  },
};
