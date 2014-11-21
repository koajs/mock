koa-mock
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa-mock.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-mock
[travis-image]: https://img.shields.io/travis/koajs/mock.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/mock
[coveralls-image]: https://img.shields.io/coveralls/koajs/mock.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/koa-mock?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat-square
[gittip-url]: https://www.gittip.com/fengmk2/
[david-image]: https://img.shields.io/david/koajs/koa-mock.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/koa-mock
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.11-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/koa-mock.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-mock

Web page mock middleware.

---

## Features

- Simple url and mock file mapping rules.
- Support `*.js`, `*.json` and common datas.


## URL Mapping Rules

Use `?__scene[={scene}]` to select mock scene, default scene is `default`.

### Rules

```
{url}?__scene={scene} => {datadir}{url}/{scene}.js
```

## Installation

```bash
$ npm install koa-mock
```

## Quick start

Using [nunjucks] template engine for example:

- **NOTICE** You must implement `ctx.render(view, data)` generator function first.
- Use `__scene[={scene}]` querystring to enable mock and select one mock scene.

### `app.js`

```js
var path = require('path');
var nunjucks = require('nunjucks');
var koa = require('koa');
var mock = require('koa-mock');

var app = koa();
app.use(mock({
  datadir: path.join(__dirname, 'mocks')
}));

nunjucks.configure(path.join(__dirname, 'views'));

app.context.render = function* (view, data) {
  this.body = nunjucks.render(view, data);
};

app.listen(1984);
```

### `/mocks` files

- /mocks
  - default.js => `{name: 'fengmk2', __view: 'home.html'}`
  - /users
    - /1
      - default.js => `{name: 'default-user', __view: 'profile.html'}`
      - fengmk2.js => `{name: 'fengmk2', __view: 'profile.html'}`

### `/views` files

- /views
  - home.html => `<p>welcome home, {{name}}</p>`
  - profile.html => `<p>profile, {{name}}</p>`

### Request the mock web page

```bash
$ curl http://localhost:1984/?__scene

Status: 200
<p>welcome home, fengmk2</p>

$ curl http://localhost:1984/users/1?__scene=default

Status: 200
<p>profile, default-user</p>

$ curl http://localhost:1984/users/1?__scene=fengmk2

Status: 200
<p>profile, fengmk2</p>

$ curl http://localhost:1984/

Status: 404
Not Found
```


## License

MIT


[nunjucks]: https://github.com/mozilla/nunjucks
