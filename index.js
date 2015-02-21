#!/usr/bin/env iojs

'use strict';

const cp = require('child_process'),
  params = process.argv.slice(2),
  Path = require('path'),
  resolve = Path.resolve,
  fs = require('fs'),
  os = require('os'),
  join = Path.join;

const YELLOW = '\x1b[33m',
  GREEN = '\x1b[32m',
  RED = '\x1b[31m';

const usage = `
  lsrepo anydir --not-clean
  lsrepo anydir --multi-branch
  lsrepo anydir --multi-remote
`;

let printUsage = false,
  multiRemote = false, // only show repos with multi remotes
  multiBranch = false, // only show repos with multi branches
  notClean = false, // only show repos not clean
  dir = params[0],
  EOL = os.EOL,
  DEPTH = 6;

if (!dir) {
  console.error(RED + 'null path');
  process.exit(1);
}

parseArgv(params);
if (printUsage) {
  console.info(usage);
  process.exit(0);
}

dir = resolve(process.cwd(), dir);

let repoPaths = dirRepos(dir, DEPTH);

repoPaths.forEach(function(p) {
  getGitRepoInfo(p);
});

/**
 * @param {string} - dir
 */
function getGitRepoInfo(dir) {
  process.chdir(dir);

  let remoteInfo = cp.spawnSync('git', ['remote']),
    branchInfo = cp.spawnSync('git', ['branch']),
    statusInfo = cp.spawnSync('git', ['status']);

  if (ignoreRepo(statusInfo, branchInfo, remoteInfo)) return;

  console.log(YELLOW + '----------------------------------------------------------------');
  console.log(GREEN + Path.basename(dir) + '    ' + dir);

  log(remoteInfo, 1);
  log(branchInfo, 2);
  log(statusInfo, 3);
}

function ignoreRepo(statusInfo, branchInfo, remoteInfo) {
  if (notClean && statusInfo.status === 0) {
    if (statusInfo.stdout.toString().includes('nothing to commit, working directory clean')) return true;
  }

  if (multiBranch && branchInfo.status === 0) {
    if (branchInfo.stdout.toString().split(EOL).length <= 2) return true;
  }

  if (multiRemote && remoteInfo.status === 0) {
    if (remoteInfo.stdout.toString().split(EOL).length <= 2) return true;
  }

  return false;
}

function log(result, flag) {
  if (result.status) {
    // error
    return console.error(RED + result.stderr.toString());
  }

  let COLOUR = '\x1b[3' + (flag + 3) + 'm';
  console.info(COLOUR + result.stdout.toString());
}

/**
 * @param {string} - path
 * @return {boolean}
 */
function notDir(path) {
  let isDir;

  try {
    isDir = fs.statSync(path).isDirectory();
  } catch (e) {
    return true;
  }

  return !isDir;
}

/**
 * @param {string} - dir
 * @return {boolean}
 */
function isRepo(dir) {
  let p = join(dir, '.git');

  try {
    fs.statSync(p);
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * @param {string} - path
 * @param {number} - depth
 * @return {array[string]}
 */
function dirRepos(path, depth) {
  if (!--depth) return [];
  if (notDir(path)) return [];
  if (isRepo(path)) return [path];

  let names = fs.readdirSync(path),
    repos = [];

  names.forEach(function(n) {
    let p = join(path, n);

    if (notDir(p)) return;
    if (isRepo(p)) return repos.push(p);

    repos = repos.concat(dirRepos(p, depth));
  });

  return repos;
}

/**
 * @param {array[string]}
 */
function parseArgv(args) {
  let contains = function(key) {
    return args.indexOf(key) !== -1;
  };

  if (contains('--help')) printUsage = true;
  if (contains('--not-clean')) notClean = true;
  if (contains('--multi-branch')) multiBranch = true;
  if (contains('--multi-remote')) multiRemote = true;
}
