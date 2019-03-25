#!/usr/bin/env node

/**
 * @overview  Unit testing cli
 */

'use strict'; // eslint-disable-line

const { findGitRoot, execute, getPackageJsonRoot } = require('./cli');


Promise.all([
  findGitRoot(),
  getPackageJsonRoot()
])
  .then(([gitRoot, packageJsonRoot]) => {
    if (!gitRoot) throw new Error('prefix-commit-jira-id: Unable to locate .git directory.');
    if (!packageJsonRoot) throw new Error('prefix-commit-jira-id: Unable to locate package.json.');

    const options = require(`${packageJsonRoot}/package`).prefixCommitId || {};

    execute(gitRoot, options);
  });
