/**!
 * koa-mock - index.js
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

var debug = require('debug')('koa-mock');
var urlmock = require('urlmock');

var IS_JSON_RE = /\.json$/;

module.exports = function (options) {
  var datadir = options.datadir;

  return function* mock(next) {
    if (!this.query.hasOwnProperty('__scene')) {
      return yield* next;
    }

    var data = urlmock(datadir, this.url);
    var view = data.__view;
    debug('mock %s => %j, view: %s', this.url, data, view);
    if (!view || IS_JSON_RE.test(this.path)) {
      return this.body = data;
    }

    yield* this.render(view, data);
  };
};
