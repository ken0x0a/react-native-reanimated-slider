module.exports = {
  '*.{ts,tsx}': [
    // './scripts/pre-commit-tsc',          // it takes too much time. I think, type check should be done @ CI
    /**
     * https://eslint.org/docs/user-guide/command-line-interface#--ignore-pattern
     */
    "eslint --fix -c .eslintrc.js --ext .ts,.tsx --ignore-pattern '**/*.d.ts' --report-unused-disable-directives",
    // "tslint --fix --exclude '**/*.d.ts", // use 'eslint' instead
    // 'prettier --write',                  // "prettier" run by "eslint"
    'git add',
  ],
}
