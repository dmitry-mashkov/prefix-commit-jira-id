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

## Usage
### Default branch naming (e.g. feature/ABC-123-description)
Once you try to make a commit, e.g. `git commit -m "your commit message"` and your current branch name is `feature/ABC-319-foo-bar`
then your real commit message will become `ABC-319: your commit message`

### Custom branch naming
To specify a custom branch pattern and a custom prefix message use a special `prefixCommitId` configuration block:

```json
{
  "prefixCommitId": {
    "pattern": "^(?:feature|bugfix)/my-name/(\\d+)",
    "prefix": "#ID: "
  }
}
```

The configuration above will work for a branch `feature/my-name/1234` and the message will look like `#1234: form was created`

In the `prefix` pattern the *ID* will be changed to the branch ID
