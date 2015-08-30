/**!
 * koa-mock - test/document_domain.js
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

var koa = require('koa');
var nunjucks = require('nunjucks-no-chokidar');
var path = require('path');
var mock = require('../');

var fixtures = path.join(__dirname, 'fixtures');

var app = koa();
app.use(mock({
  datadir: path.join(fixtures, 'mocks'),
  documentDomain: 'localhost',
}));

app.use(function* () {
  if (this.path === '/domain') {
    return yield this.render('domain.html', {
      domain: 'localhost'
    });
  }
});

nunjucks.configure(path.join(fixtures, 'views'));

app.context.render = function* (view, data) {
  this.body = nunjucks.render(view, data);
};

if (!module.parent) {
  app.listen(1984);
  console.log('open http://localhost:1984');
}

module.exports = app;
