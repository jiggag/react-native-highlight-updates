module.exports = {
  root: true,
  extends: '@react-native-community',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
  },
};
