module.exports = {
  extends: ["@ken0x0a/eslint-config"],
  rules: {
    camelcase: 0,
    "@typescript-eslint/naming-convention": 0,
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
