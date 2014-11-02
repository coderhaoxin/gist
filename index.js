#!/usr/bin/env node

'use strict';

var cp = require('child_process'),
  params = process.argv.slice(2),
  Path = require('path'),
  fs = require('fs'),
  dir = params[0];

var RED = '\x1b[31m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m';

var depth = 6;

var resolve = Path.resolve,
  join = Path.join;

// BLUE = '\x1b[34m'
// MAGENTA = '\x1b[35m'
// CYAN = '\x1b[36m'

if (!dir) {
  console.error(RED + 'null path');
  process.exit(1);
}

dir = resolve(process.cwd(), dir);

var repoPaths = dirRepos(dir);

repoPaths.forEach(function(p) {
  getGitRepoInfo(p);
});

function getGitRepoInfo(d) {
  process.chdir(d);

  console.log(YELLOW + '----------------------------------------------------------------');
  console.log(GREEN + Path.basename(d));

  var result = cp.spawnSync('git', ['remote']);

  log(result, 1);

  result = cp.spawnSync('git', ['branch']);

  log(result, 2);

  result = cp.spawnSync('git', ['status']);

  log(result, 3);
}

function log(result, flag) {
  if (result.status) {
    console.error(RED + result.stderr.toString());
  } else {
    var COLOUR = '\x1b[3' + (flag + 3) + 'm';

    console.info(COLOUR + result.stdout.toString());
  }
}


function notDir(path) {
  var isDir;

  try {
    isDir = fs.statSync(path).isDirectory();
  } catch (e) {
    return true;
  }

  return !isDir;
}

function isRepo(dir) {
  var p = join(dir, '.git');

  try {
    fs.statSync(p);
  } catch (e) {
    return false;
  }

  return true;
}

function dirRepos(path) {
  if (!--depth) return [];
  if (notDir(path)) return [];
  if (isRepo(path)) return [path];

  var names = fs.readdirSync(path),
    repos = [];

  names.forEach(function(n) {
    var p = join(path, n);

    if (notDir(p)) return;
    if (isRepo(p)) return repos.push(p);

    repos = repos.concat(dirRepos(p));
  });

  return repos;
}
