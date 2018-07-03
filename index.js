#!/usr/bin/env node

/**
 * @overview  Unit testing cli
 */

'use strict'; // eslint-disable-line

const {findGitRoot, execute} = require('./cli');


findGitRoot()
  .then(root => {
    if (!root) throw new Error('prefix-commit-jira-id: Unable to locate .git directory.');

    execute(root);
  });