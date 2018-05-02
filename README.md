# prefix-commit-jira-id

Auto JIRA issue ID prefixer for GIT workflow

## Prerequisites

You have to install `husky` (`npm i -D husky`) according to override commit-message git hook 

### Installing

Inside your `package.json` add a standard husky npm script for the git hook:

```
{
  "scripts": {
    "commitmsg": "./node_modules/.bin/prefix-commit-jira-id"
  }
}
```
