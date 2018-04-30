#!/usr/bin/env bash

INPUT_FILE=$1
START_LINE=`head -n1 $INPUT_FILE`
branchName=`git rev-parse --abbrev-ref HEAD`
jiraId=$(echo $branchName | sed -nr 's,([a-z]+),\1,p')

#echo $jiraId

sed -i.bak -e "1s/^/\n\n$jiraId: /" $1

PATTERN="^(MYPROJ)-[[:digit:]]+: "
if ! [[ "$START_LINE" =~ $PATTERN ]]; then
  echo "Bad commit message, see example: MYPROJ-123: commit message"
  exit 1
fi

exit 1
