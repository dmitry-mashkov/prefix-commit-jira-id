/**
 * @overview  Auto JIRA issue ID prefixer for GIT workflow
 *
 * Parses JIRA ID out from a branch name and prepends it to the commit message.
 * Important: works only with GIT workflow, therefore branches names should start with "feature|bugfix|hotfix|release"
 * Skips commit messages that start with:
 * - square bracket [
 * - Merge branch
 * - Merge pull request
 * - #
 *
 *
 * @example
 *
 * Branch name: feature/TAG-123-branch-description
 * User commit message: My awesome commit
 * Result commit message: TAG-123: My awesome commit
 */

const fs = require('fs');
const { flow, reduce, concat, startsWith, anyPass, split, first } = require('lodash/fp');
const childProcess = require('child_process');
const findUp = require('find-up');
const { dirname } = require('path');


function findGitRoot() {
  const cwd = process.cwd();

  return findUp('.git', { cwd })
    .then(filepath => (filepath ? dirname(filepath) : null));
}

function execute(gitRoot) {
  let message;
  let messageFilePath = `${gitRoot}/${process.env.GIT_PARAMS}`;

  try {
    message = fs.readFileSync(messageFilePath, { encoding: 'utf-8' });
  } catch (ex) {
    throw new Error(`prefix-commit-jira-id: Unable to read the file "${messageFilePath}".`);
  }

  const branchName = getBranchName(gitRoot);
  const issueId = getIssueIdFromBranchName(branchName);

  if (issueId && !isCommitMessageReserved(message)) {
    message = `${issueId}: ${message}`;
    fs.writeFileSync(messageFilePath, message, { encoding: 'utf-8' });
  }
}

/**
 * Obtains the git branch name
 *
 * @returns {string|undefined}
 */
function getBranchName(gitRoot) {
  return flow([
    () => childProcess.execSync(`git --git-dir=${gitRoot}/.git rev-parse --abbrev-ref HEAD`, { encoding: 'utf-8' }),
    split('\n'),
    first
  ])();
}

/**
 * Parses git branch name
 *
 * @param {string} branchName - git branch name
 * @returns {string | null} - JIRA issue ID
 */
function getIssueIdFromBranchName(branchName) {
  const jiraIdPattern = /^(?:feature|bugfix|hotfix|release)\/([A-Z]+-\d+)-.+/i;
  const matched = branchName.match(jiraIdPattern);

  return matched && matched[1];
}

/**
 * Checks if the commit message is a standard reserved one
 *
 * @param {string} message - commit message
 * @returns {boolean} - true if it is a reserved one
 */
function isCommitMessageReserved(message) {
  const specialCommitPrefixes = [
    'Merge branch',
    'Merge pull request',
    '#',
    '['
  ];

  const predicates = reduce((predicates, prefix) => concat(predicates, startsWith(prefix)), [])(specialCommitPrefixes);

  return anyPass(predicates)(message);
}

module.exports = {
  findGitRoot,
  execute,
  getBranchName,
  getIssueIdFromBranchName,
  isCommitMessageReserved
};