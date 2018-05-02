#!/usr/bin/env node

const fs = require('fs');
const _ = require('lodash/fp');
const childProcess = require('child_process');

const MESSAGE_FILE_PATH = process.env.GIT_PARAMS;

/* If message title:
 * * Doesn't start with square brackets []
 * * Doesn't start with Merge branch
 * * Doesn't start with Merge pull request
 * * Doesn't start with #
 * and
 * branch name starts with ${JIRA_TAG}-XXX (e.g. TAG-123-branch-description)
 * then prepend the issue tag to the commit message
 *
 * My awesome commit -> [TAG-123] My awesome commit
 */


main();


function main() {
  let message = fs.readFileSync(MESSAGE_FILE_PATH, { encoding: 'utf-8' });
  const branchName = getBranchName();
  const issueTag = getIssueTagFromBranchName(branchName);

  if (issueTag && !commitMessageIsSpecial(message)) {
    message = `${issueTag}: ${message}`;
    fs.writeFileSync(MESSAGE_FILE_PATH, message, { encoding: 'utf-8' });
  }
}

function getBranchName() {
  return childProcess
    .execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' })
    .split('\n')[0];
}

function getIssueTagFromBranchName (str) {
  const jiraTagPattern = /^(?:feature|bugfix|hotfix|release)\/([A-Z]+-\d+)-.+/i;
  const matched = str.match(jiraTagPattern);

  return matched && matched[1];
}

function commitMessageIsSpecial(message) {
  // Skip if starts with braces
  // if (_.overSome([])(message))

  if (message.match(/^\[[^\]]/)) return false;

  // Skip if starts with standard merge message
  if (
    _.startsWith(message, 'Merge branch') ||
    _.startsWith(message, 'Merge pull request')
  ) return false;

  if (_.startsWith('#')) return false;

  return true;
}


/*
const startsWithBraces = (str) => str.match(/^\[[^\]]/);
const startsWithMergeBranch = (str) => str.indexOf('Merge branch') === 0;
const startsWithMergePR = (str) => str.indexOf('Merge pull request') === 0;
const startsWithHash = (str) => str.indexOf('#') === 0;
const isInvalidMessage = (str) => !startsWithBraces(str)
                               && !startsWithMergeBranch(str)
                               && !startsWithMergePR(str)
                               && !startsWithHash(str);

*/
