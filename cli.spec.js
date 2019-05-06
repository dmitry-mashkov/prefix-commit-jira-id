/**
 * @overview  Unit testing cli
 */

const test = require('ava');
const sinon = require('sinon');
const childProcess = require('child_process');
const fs = require('fs');
const {
  findGitRoot,
  execute,
  getBranchName,
  getIssueIdFromBranchName,
  isCommitMessageReserved,
  isPrefixAllowed
} = require('./cli');

let childProcessStub;

test('getBranchName returns the name found', t => {
  childProcessStub = sinon.stub(childProcess, 'execSync');
  childProcessStub.returns('branch-name\nsecond line');

  const gitRoot = 'some/fake/path';
  const branchName = getBranchName(gitRoot);

  t.is(branchName, 'branch-name');
});

test('getIssueIdFromBranchName parses the branch name properly', t => {
  t.is(getIssueIdFromBranchName('feature/test-123-and-some-description'), 'test-123');
  t.is(getIssueIdFromBranchName('bugfix/test-123-and-some-description'), 'test-123');
  t.is(getIssueIdFromBranchName('hotfix/test-123-and-some-description'), 'test-123');
  t.is(getIssueIdFromBranchName('release/test-123-and-some-description'), 'test-123');
  t.is(getIssueIdFromBranchName('FEATURE/teST-123-and-some-description'), 'teST-123');
  t.is(getIssueIdFromBranchName('some-prefix-123-and-some-description', '^some-prefix-(\\d+)'), '123');

  t.falsy(getIssueIdFromBranchName('feature/test-123'));
  t.falsy(getIssueIdFromBranchName('feature/test123'));
  t.falsy(getIssueIdFromBranchName('/test-123'));
  t.falsy(getIssueIdFromBranchName('superfeature/test-123'));
  t.falsy(getIssueIdFromBranchName('superfeature/test-123'));
});

test('isCommitMessageReserved checks that message contains reserved keywords', t => {
  t.true(isCommitMessageReserved('Merge branch a to b'));
  t.true(isCommitMessageReserved('Merge pull request #1 to develop'));
  t.true(isCommitMessageReserved('#100500'));
  t.true(isCommitMessageReserved('[nothing to add. Very special]'));

  t.false(isCommitMessageReserved('Basic implementation finished'));
  t.false(isCommitMessageReserved('Prefix: Merge branch a to b'));
  t.false(isCommitMessageReserved('Pull request #1 merged to develop'));
});

test('isPrefixAllowed checks that jira issue ID was not specified and current message is not a special one', t => {
  t.true(isPrefixAllowed('Commit message for ABC-124', 'ABC-123'));
  t.true(isPrefixAllowed('Commit message', 'ABC-123'));

  t.false(isPrefixAllowed('Commit message for ABC-123', 'ABC-123'));
  t.false(isPrefixAllowed('ABC-123: new message added', 'ABC-123'));
});

test('findGitRoot finds nearest git root in a tree', async t => {
  const gitRootPromise = findGitRoot();
  const cwd = process.cwd();

  t.is(await gitRootPromise, cwd);
});

test('execute writes jira number into the git message file', t => {
  let processedMessage;

  childProcessStub.returns('feature/ABC-123-description\nsecond line');
  sinon.stub(fs, 'readFileSync').returns('Message about changes');
  sinon.stub(fs, 'writeFileSync').callsFake((file, message) => {
    processedMessage = message;
  });

  const cwd = process.cwd();
  execute(cwd);

  t.is(processedMessage, 'ABC-123: Message about changes');
});
