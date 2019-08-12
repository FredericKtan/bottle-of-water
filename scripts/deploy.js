#! /usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { compose, map, replace, match, trim } = require('ramda');
const dotenv = require('dotenv');

dotenv.config();

const options = { encoding: 'utf-8', stdio : 'pipe' };

const diff = execSync('git --no-pager  log origin/master..origin/staging --oneline --grep "Merge pull request"', options);

const issuesId = compose(map(compose(replace('#', ''), trim)), match(/\s#(.\d*)\s/gm))(diff);

let body = "";

const issues = [];

issuesId.map(id => {
  const issue = execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/FredericKtan/bottle-of-water/issues/${id}`, options);
  const jsonParsedIssue = JSON.parse(issue);

  console.log({ jsonParsedIssue });
  issues.push({
    title: jsonParsedIssue.title,
    url: jsonParsedIssue.html_url
  });
})

const pullRequest = {
  title: `Push to production - ${process.env.npm_package_version}`,
  body: `# Push to production - ${process.env.npm_package_version}\\n## Changelog\\n`,
};
console.log(`> Found ${issuesId.length} issues`);

issues.forEach(issue => {
  pullRequest.body = pullRequest.body + "- " + issue.title + "\\n";
  console.log('> - [', issue.title, '](', issue.url, ')');
})

// const createPullRequest = execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -d  '{"title": "${pullRequest.title}", "body": "${pullRequest.body}", "head": "staging", "base": "master"}' https://api.github.com/repos/fredericktan/bottle-of-water/pulls`, options);

// const jsonParsedCreatePullRequest = JSON.parse(createPullRequest);
// if (jsonParsedCreatePullRequest.errors) {
//   console.log('> Create pull request failed...\n', jsonParsedCreatePullRequest.errors);
// } else {
//   console.log(`> Pull request created successfully @ ${jsonParsedCreatePullRequest.html_url} !`);
// }
