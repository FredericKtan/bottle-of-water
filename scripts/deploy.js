#! /usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { compose, map, replace, match, trim } = require('ramda');
const dotenv = require('dotenv');

dotenv.config();

const diff = execSync('git --no-pager  log origin/master..origin/staging --oneline --grep "Merge pull request"', {
  encoding: 'utf-8',
});

const issues = compose(map(compose(replace('#', ''), trim)), match(/\s#(.\d*)\s/gm))(diff);

let body = "";

const raw = [];

issues.map(issue => {
  const a = execSync(`curl -H "Authorization: token dc881fe1e0b957b8e4e937ddf4109d95879fe328" -H "Content-Type: application/json" https://api.github.com/repos/FredericKtan/bottle-of-water/issues/${issue}`, {
    encoding: 'utf-8',
  });
  const options = {
    headers: {
      'User-Agent': 'request'
    }
  };

  const c = JSON.parse(a);

  raw.push(c.title);
})

console.log({ raw });

// curl -H "Authorization: token dc881fe1e0b957b8e4e937ddf4109d95879fe328" -d  '{"title": "Amazing new feature", "body": "Please pull this in!", "head": "enhancement/add-deploy-script", "base": "staging"}' https://api.github.com/repos/fredericktan/bottle-of-water/pulls
console.log({ body, diff, issues });

console.log(`> Found ${issues.length} issues`);

