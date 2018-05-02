/**
 * @overview  Auto JIRA issue ID prefixer for GIT flow
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
const _ = require('lodash/fp');
const childProcess = require('child_process');

const MESSAGE_FILE_PATH = process.env.GIT_PARAMS;


main();


/**
 * Entry point of the script
 */
function main() {
  let message = fs.readFileSync(MESSAGE_FILE_PATH, { encoding: 'utf-8' });
  const branchName = getBranchName();
  const issueId = getIssueIdFromBranchName(branchName);

  if (issueId && !commitMessageIsReserved(message)) {
    message = `${issueId}: ${message}`;
    fs.writeFileSync(MESSAGE_FILE_PATH, message, { encoding: 'utf-8' });
  }
}

/**
 * Obtains the git branch name
 *
 * @returns {string}
 */
function getBranchName() {
  return childProcess
    .execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' })
    .split('\n')[0];
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
function commitMessageIsReserved(message) {
  const specialCommitPrefixes = [
    'Merge branch',
    'Merge pull request',
    '#',
    '['
  ];

  return _.flow([
    _.reduce((result, current) => _.concat(result, _.startsWith(current)), []),
    _.anyPass
  ])(specialCommitPrefixes)(message);
}

