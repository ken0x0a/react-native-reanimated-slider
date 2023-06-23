module.exports = {
  extends: ["@ken0x0a/eslint-config"],
  rules: {
    camelcase: 0,
    "@typescript-eslint/naming-convention": 0,
    curly: [2, "all"],
  },
  overrides: [
    {
      // for JS files
      files: ["**/*.js"],
      parserOptions: {
        project: "tsconfig.js.json",
      },
    },
  ],
};
