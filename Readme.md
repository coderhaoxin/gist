# deprecated

[![License][license-img]][license-url]

### lsrepo
* too many git repos in the computer ?
* just want to know is there any repo has multi remotes ?
* just want to know is there any repo has multi branches ?
* just want to know is there any repo not `nothing to commit, working directory clean` ?

### usage

```sh
npm install -g coderhaoxin/lsrepo
```

run

```sh
lsrepo ~
# or
lsrepo anydir
```

* only want to show the repos: not `working directory clean` ?

```sh
lsrepo anydir --not-clean
```

* only want to show the repos: `branch > 1` ?

```sh
lsrepo anydir --multi-branch
```

* only want to show the repos: `remote > 1` ?

```sh
lsrepo anydir --multi-remote
```

### License
MIT

[npm-img]: https://img.shields.io/npm/v/lsrepo.svg?style=flat-square
[npm-url]: https://npmjs.org/package/lsrepo
[license-img]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: http://opensource.org/licenses/MIT
[david-img]: https://img.shields.io/david/coderhaoxin/lsrepo.svg?style=flat-square
[david-url]: https://david-dm.org/coderhaoxin/lsrepo
