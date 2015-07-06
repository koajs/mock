/**!
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

var koa = require('koa');
var nunjucks = require('nunjucks');
var path = require('path');
var mock = require('../');

var fixtures = path.join(__dirname, 'fixtures');

var app = koa();
app.use(mock({
  datadir: path.join(fixtures, 'mocks')
}));

app.use(function* () {
  if (this.path === '/') {
    return yield this.render('home.html', {});
  }
  if (/^\/users\/\d+/.test(this.path)) {
    return yield this.render('profile.html', {});
  }
  if (this.path === '/user') {
    return this.body = {};
  }
  if (this.path === '/buffer') {
    this.type = 'html';
    return this.body = new Buffer('buffer string');
  }
  if (this.path === '/foo.json') {
    return this.body = {
      foo: 'bar'
    };
  }
});

nunjucks.configure(path.join(fixtures, 'views'));

app.context.render = function* (view, data) {
  var that = this;
  data = data || '';
  data.helper = {
    getSessionId: function() {
      return that.sessionId;
    }
  };
  this.body = nunjucks.render(view, data);
};

if (!module.parent) {
  app.listen(1984);
  console.log('open http://localhost:1984');
}

module.exports = app;
