module.exports = {
  linters: {
    '**/*.+(js|jsx|md|ts|css|scss|sass|less|graphql|yml|yaml|json)': [
      'eslint --fix',
      'prettier --write',
      'git add',
    ],
  },
  ignore: ['package.json'],
}
