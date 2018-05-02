#!/usr/bin/env node

import * as fs from 'fs';

const JIRA_TAG = 'TAG';

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

const startsWithBraces = (str) => str.match(/^\[[^\]]/);
const startsWithMergeBranch = (str) => str.indexOf('Merge branch') === 0;
const startsWithMergePR = (str) => str.indexOf('Merge pull request') === 0;
const startsWithHash = (str) => str.indexOf('#') === 0;
const isInvalidMessage = (str) =>
!startsWithBraces(str) && !startsWithMergeBranch(str) && !startsWithMergePR(str) && !startsWithHash(str);
const tagMatcher = new RegExp(`^${JIRA_TAG}-\\d+`, 'i');
const getIssueTagFromBranchName = (str) => {
  const matched = str.match(tagMatcher);
  return matched && matched[0];
};

const messageFile = process.env.GIT_PARAMS;
const message = fs.readFileSync(messageFile, { encoding: 'utf-8' });
const messageTitle = message.split('\n')[0];
const branchName = require('child_process').execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).split('\n')[0];
const issueTag = getIssueTagFromBranchName(branchName);

if (issueTag && isInvalidMessage(messageTitle)) {
  // Apply the issue tag to message title
  const messageLines = message.split('\n');
  messageLines[0] = `[${issueTag.toUpperCase()}] ${messageTitle}`;
  fs.writeFileSync(messageFile, messageLines.join('\n'), { encoding: 'utf-8' });
  console.log(`New message title: ${messageLines[0]}`);
}