module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-max-length': [2, 'always', 120],
    'scope-enum': [2, 'always', []],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'feat',
        'doc',
        'bump',
        'chore',
        'lint',
        'ci',
        'fix',
        'refacto',
        'release',
        'revert',
        'test',
        'wip'
      ]
    ]
  }
};
