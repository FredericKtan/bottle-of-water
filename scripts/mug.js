#! /usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { compose, head, map, replace, match, pick, trim, values, keys } = require('ramda');
const dotenv = require('dotenv');
const { getCardsWithListId } = require('../helpers/coca');

dotenv.config();

const options = { encoding: 'utf-8', stdio : 'pipe' };


// Algorithm is starting

const files = execSync(`cat ~/Workspace/ffyn/front/package.json`, options);

const json = JSON.parse(files);
const { dependencies, devDependencies } = json;
values(dependencies).forEach(value => console.log(value));

// End of algorithm
