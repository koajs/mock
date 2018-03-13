/**
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

const debug = require('debug')('koa-mock');
const urlmock = require('urlmock');
const utility = require('utility');

const IS_JSON_RE = /\.json$/;

module.exports = options => {
  const datadir = options.datadir;

  return async function mock(ctx, next) {
    if (!utility.has(ctx.query, '__scene')) {
      return next();
    }

    const data = urlmock(datadir, ctx);
    const view = data.__view;
    debug('mock %s => %j, view: %s', ctx.url, data, view);
    if (!view || IS_JSON_RE.test(ctx.path)) {
      return ctx.body = data;
    }

    return ctx.render(ctx, view, data);
  };
};
