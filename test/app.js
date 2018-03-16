/**
 * koa-mock - test/app.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const Koa = require('koa');
const nunjucks = require('nunjucks-no-chokidar');
const path = require('path');
const mock = require('../');

const fixtures = path.join(__dirname, 'fixtures');

const app = new Koa();
app.use(mock({
  datadir: path.join(fixtures, 'mocks')
}));

app.use(async ctx => {
  if (ctx.path === '/') {
    return ctx.render(ctx, 'home.html', {});
  }
  if (/^\/users\/\d+/.test(ctx.path)) {
    return ctx.render(ctx, 'profile.html', {});
  }
  if (ctx.path === '/user') {
    return ctx.body = {};
  }
  if (ctx.path === '/buffer') {
    ctx.type = 'html';
    return ctx.body = Buffer.from('buffer string');
  }
  if (ctx.path === '/foo.json') {
    return ctx.body = {
      foo: 'bar'
    };
  }
});

nunjucks.configure(path.join(fixtures, 'views'));

app.context.render = async function (ctx, view, data) {
  data = data || {};
  if (ctx.state){
    Object.keys(ctx.state).forEach(function(key){
      if (!data.hasOwnProperty(key)){
        data[key] = ctx.state[key];
      }
    }, ctx);
  }
  data.helper = {
    getSessionId: function() {
      return ctx.sessionId;
    }
  };
  ctx.body = nunjucks.render(view, data);
};

Object.defineProperty(app.context, 'sessionId', {
  get function() {
    return 'getter sessionId';
  }
});

if (!module.parent) {
  app.listen(1984);
  console.log('open http://localhost:1984');
}

module.exports = app;
