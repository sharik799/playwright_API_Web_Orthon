module.exports = {
  env: {
    node: true,
    es2021: true,
    browser: true,
  },

  parser: "@typescript-eslint/parser",

  plugins: ["@typescript-eslint"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],

  rules: {
    quotes: ["error", "backtick"],
    semi: ["error", "always"],

    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",

    "no-undef": "off",

    "@typescript-eslint/no-explicit-any": "off",
    "no-empty-pattern": "off",

    "prefer-const": "error",
  },
};