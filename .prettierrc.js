module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
  arrowParens: 'always',
  endOfLine: 'lf',
  bracketSpacing: true,
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  overrides: [
    {
      files: '*.md',
      options: {
        tabWidth: 2,
      },
    },
    {
      files: '*.json',
      options: {
        tabWidth: 2,
      },
    },
  ],
};