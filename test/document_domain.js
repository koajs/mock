/**
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

const Koa = require('koa');
const nunjucks = require('nunjucks-no-chokidar');
const path = require('path');
const mock = require('../');

const fixtures = path.join(__dirname, 'fixtures');

const app = new Koa();
app.use(mock({
  datadir: path.join(fixtures, 'mocks'),
  documentDomain: 'localhost'
}));

app.use(async () => {
  if (this.path === '/domain') {
    return this.render('domain.html', {
      domain: 'localhost'
    });
  }
});

nunjucks.configure(path.join(fixtures, 'views'));

app.context.render = async function(ctx, view, data) {
  ctx.body = nunjucks.render(view, data);
};

if (!module.parent) {
  app.listen(1984);
  console.log('open http://localhost:1984');
}

module.exports = app;
