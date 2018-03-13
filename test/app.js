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

var Koa = require('koa');
var nunjucks = require('nunjucks');
var path = require('path');
var mock = require('../');

var fixtures = path.join(__dirname, 'fixtures');

var app = new Koa();
app.use(mock({
  datadir: path.join(fixtures, 'mocks')
}));

nunjucks.configure(path.join(fixtures, 'views'));

app.context.render = async function(ctx, view, data) {
  ctx.body = nunjucks.render(view, data);
};

module.exports = app;
