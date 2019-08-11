#! /usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { compose, map, replace, match, trim } = require('ramda');
const dotenv = require('dotenv');

dotenv.config();

const diff = execSync('git --no-pager  log origin/master..origin/staging --oneline --grep "Merge pull request"', {
  encoding: 'utf-8',
});

const issuesId = compose(map(compose(replace('#', ''), trim)), match(/\s#(.\d*)\s/gm))(diff);

let body = "";

const issuesTitle = [];

issuesId.map(id => {
  const issue = execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/FredericKtan/bottle-of-water/issues/${id}`, {
    encoding: 'utf-8',
  });
  const jsonParsedIssue = JSON.parse(issue);

  issuesTitle.push(jsonParsedIssue.title);
})

const pullRequest = {
  title: `Push to production - ${process.env.npm_package_version}`,
  body: '#Push to production - 0.1.0\\n## Changelog\\n',
};
console.log(`> Found ${issuesId.length} issues`);

issuesTitle.forEach(title => {
  pullRequest.body = pullRequest.body + "- " + title + "\\n";
  console.log('> - ', title);
})

console.log({ pullRequest });
console.log(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -d  '{"title": "${pullRequest.title}", "body": "${pullRequest.body}", "head": "staging", "base": "master"}' https://api.github.com/repos/fredericktan/bottle-of-water/pulls`);

const createPullRequest = execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -d  '{"title": "${pullRequest.title}", "body": "${pullRequest.body}", "head": "staging", "base": "master"}' https://api.github.com/repos/fredericktan/bottle-of-water/pulls`, {
  encoding: 'utf-8',
});
