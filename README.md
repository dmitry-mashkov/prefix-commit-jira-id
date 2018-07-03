prefix-commit-jira-id
=====================

[![Build Status](https://travis-ci.org/dmitry-mashkov/prefix-commit-jira-id.svg?branch=master)](https://travis-ci.org/dmitry-mashkov/prefix-commit-jira-id)

Auto JIRA issue ID prefixer for GIT workflow

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
  "scripts": {
    "commitmsg": "./node_modules/.bin/prefix-commit-jira-id"
  }
}
```

## Supported branch types
* feature/JIRAISSUE-123-some-description
* bugfix/JIRAISSUE-123-some-description
* hotfix/JIRAISSUE-123-some-description
* release/JIRAISSUE-123-some-description