#! /usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { compose, head, map, replace, match, pick, trim } = require('ramda');
const dotenv = require('dotenv');
const { getCardsWithListId } = require('../helpers/coca');

dotenv.config();

const options = { encoding: 'utf-8', stdio : 'pipe' };

// const diff = execSync('git --no-pager  log origin/master..origin/staging --oneline --grep "Merge pull request"', options);
// const diff = execSync('git --no-pager  log origin/master..origin/preprod --oneline --grep "Merge pull request"', options);
const diff = `
9b2032a29 Merge pull request #1913 from ffyn/s72/4433-get-user-registration-token-2
94db0eebf Merge pull request #1911 from ffyn/s72/no-secure-cookies-local
8dbf299d4 Merge pull request #1904 from ffyn/s71/fix-button-height
38973661a Merge pull request #1908 from ffyn/s72/secure-cookies
e275fa170 Merge pull request #1867 from ffyn/s69/4314-authentication-persisted
a76157e8f Merge pull request #1900 from ffyn/s71/archi-fix-login
848964b4c Merge pull request #1906 from ffyn/s72/4441
40da1f70f Merge pull request #1903 from ffyn/s72/dark-corners-ffyn
`;

const issuesId = compose(map(compose(replace('#', ''), trim)), match(/\s#(.\d*)\s/gm))(diff);

let body = "";

const issues = [];

issuesId.map(id => {
  // const issue = execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/FredericKtan/bottle-of-water/issues/${id}`, options);
  const issue = execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/ffyn/ffyn/issues/${id}`, options);
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

const ffynDoneTasks = execSync(`curl "${getCardsWithListId(process.env.TRELLO_CURRENT_SPRINT_ID)}"`, options);

const getCardsTitle = compose(
    pick(['name']),
    JSON.parse,
);

const comments = JSON.parse(execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/ffyn/ffyn/issues/1917/comments`, options));
// const comments = JSON.parse(execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -H "Content-Type: application/json" https://api.github.com/repos/FredericKtan/bottle-of-water/issues/20/comments`, options));

console.log({ url: getCardsWithListId(process.env.TRELLO_CURRENT_SPRINT_ID), ffynDoneTasks: JSON.parse(ffynDoneTasks).map(pick(['name', 'idShort', 'url'])) });
console.log({ comments })
// const createPullRequest = execSync(`curl -H "Authorization: token ${process.env.GITHUB_TOKEN}" -d  '{"title": "${pullRequest.title}", "body": "${pullRequest.body}", "head": "staging", "base": "master"}' https://api.github.com/repos/fredericktan/bottle-of-water/pulls`, options);

// const jsonParsedCreatePullRequest = JSON.parse(createPullRequest);
// if (jsonParsedCreatePullRequest.errors) {
//   console.log('> Create pull request failed...\n', jsonParsedCreatePullRequest.errors);
// } else {
//   console.log(`> Pull request created successfully @ ${jsonParsedCreatePullRequest.html_url} !`);
// }
