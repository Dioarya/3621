export default {
  '*.{ts,tsx,js,jsx}': (stagedFiles) => {
    if (stagedFiles.length > 0) {
      return ['oxlint src/'];
    }
    return [];
  },
  '*.{ts,tsx,js,jsx,json,html,md}': ['oxfmt --no-error-on-unmatched-pattern'],
  '*.css': ['stylelint --fix', 'oxfmt --no-error-on-unmatched-pattern'],
};
