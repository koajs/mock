koa-mock
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][cov-image]][cov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa-mock.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-mock
[travis-image]: https://img.shields.io/travis/koajs/mock.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/mock
[cov-image]: https://codecov.io/github/koajs/mock/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/koajs/mock?branch=master
[david-image]: https://img.shields.io/david/koajs/mock.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/mock
[download-image]: https://img.shields.io/npm/dm/koa-mock.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-mock

Web page mock middleware.

---

## Features

- Simple url and mock file mapping rules.
- Support `*.js`, `*.json` and common datas.
- Auto find all scenes and easy change it
![koa-mock](https://cloud.githubusercontent.com/assets/156269/5139054/be4f779e-7193-11e4-8a8d-87f12c9a1dbc.gif)


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

- **NOTICE** You must implement `ctx.render(ctx, view, data)` generator function first.
- Use `__scene[={scene}]` querystring to enable mock and select one mock scene.

### `app.js`

```js
const path = require('path');
const nunjucks = require('nunjucks');
const Koa = require('koa');
const mock = require('koa-mock');

const app = new Koa();
app.use(mock({
  datadir: path.join(__dirname, 'mocks')
}));

nunjucks.configure(path.join(__dirname, 'views'));

app.context.render = async function(ctx, view, data) {
  ctx.body = nunjucks.render(view, data);
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
