module.exports = {
  extends: ['@ken0x0a/eslint-config'],
  rules: {},
  overrides: [
    {
      // for JS files
      files: ['**/*.js'],
      parserOptions: {
        project: 'tsconfig.js.json',
      },
    },
  ],
}
