module.exports = {
  root: true,
  extends: [
    'blockabc/typescript'
  ],
  rules: {
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-non-null-assertion': 1,
    "no-unused-vars": 1,
  }
}
