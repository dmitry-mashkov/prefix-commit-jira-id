prefix-commit-jira-id
=====================

[![Build Status](https://travis-ci.org/dmitry-mashkov/prefix-commit-jira-id.svg?branch=master)](https://travis-ci.org/dmitry-mashkov/prefix-commit-jira-id)

Configurable auto issue ID prefixer for GIT workflow. Make `git commit -m "your commit message"` be `ABC-318: your commit message`

## Prerequisites

You have to install `husky` (`npm i -D husky`) according to override commit-message git hook 

## Installation

Install the package using NPM

```sh
$ npm install prefix-commit-jira-id --save-dev
```

## Configuration

Inside your `package.json` add a standard husky npm script for the git hook:

```json
{
  "husky": {
    "hooks": {
       "commit-msg": "prefix-commit-jira-id"
     }
  }
}
```

To specify a custom branch pattern and a custom prefix message use a special prefixCommitId configuration block:

```json
{
  "prefixCommitId": {
    "pattern": "^(?:feature|bugfix)/my-name/(\\d+)",
    "prefix": "#ID: "
  }
}
```

In the `prefix` pattern the *ID* will be changed to the branch ID

## Usage
Once you try to make a commit, e.g. `git commit -m "your commit message"` and your current branch name is `feature/ABC-319-foo-bar`
then your real commit message will become `ABC-319: your commit message`

*Note*: commits made from IDE are also preprocessed

## Supported branch types
* feature/JIRAISSUE-123-some-description
* bugfix/JIRAISSUE-123-some-description
* hotfix/JIRAISSUE-123-some-description
* release/JIRAISSUE-123-some-description
