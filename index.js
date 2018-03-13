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
const urlparse = require('url').parse;
const path = require('path');
const fs = require('fs');

const IS_JSON_RE = /\.json$/;

module.exports = options => {
  const datadir = options.datadir;
  const documentDomain = options.documentDomain || '';
  const isAjax = options.isAjax || defaultDetectAjax;

  return async function mock(ctx, next) {
    if (ctx.path === '/__koa_mock_scene_toolbox') {
      ctx.type = 'html';
      ctx.set('x-koa-mock', true);
      const targetUri = urlparse(ctx.href, true).query.target_uri;
      if (targetUri) {
        const scenes = urlmock.findAllScenes(datadir, targetUri);
        const body = fs.readFileSync(path.join(__dirname, 'scene_toolbox.html'), 'utf8');
        debug('scenes %j when targetUri %s', scenes, targetUri);
        return ctx.body = body.replace(/<\/select>/, '<script>window.__koa_mock_scenes=' + JSON.stringify(scenes) + '</script>');
      } else {
        return ctx.body = fs.createReadStream(path.join(__dirname, 'scene_toolbox.html'));
      }
    }

    if (!Object.prototype.hasOwnProperty.call(ctx.query, '__scene')) {
      const referer = ctx.get('referer');
      if (referer && referer.indexOf('__scene=') > 0 && isAjax(ctx)) {
        return mockAjax(ctx, next);
      }
      ctx.set('x-koa-mock', false);
      await next();
      inject(ctx);
      return;
    }

    ctx.set('x-koa-mock', true);

    const data = urlmock(datadir, ctx);
    const context = data.__context || {};
    for (const key in context) {
      if (ctx.hasOwnProperty(key)) {
        delete ctx[key];
      }
      Object.defineProperty(ctx, key, {
        writable: true,
        configurable: true,
        enumerable: true,
        value: context[key]
      });
    }

    if (data.__skipRender) {
      await next();
    } else {
      const view = data.__view;
      debug('mock %s => %j, view: %s', ctx.url, data, view);
      if (!view || IS_JSON_RE.test(ctx.path)) {
        return ctx.body = data;
      }
      await ctx.render(ctx, view, data);
    }
    inject(ctx);
  };

  function inject(ctx) {
    if (!ctx.response.is(['html']) || typeof ctx.body !== 'string') {
      return;
    }

    // add scene toolbox iframe
    const iframe = `<iframe src="/__koa_mock_scene_toolbox?domain=${encodeURIComponent(documentDomain)}&target_uri=${ctx.url}
      " style="position: fixed; right: 0; border: 0; bottom: 10px; margin: 0; padding: 0; height: 30px; z-index: 99998;"></iframe></body>`;

    debug('inject %s', ctx.url);
    ctx.body = ctx.body.replace(/<\/body>/, iframe);
  }

  async function mockAjax(ctx, next) {
    const info = urlparse(ctx.get('referer'), true);
    if (ctx.url.indexOf('?') > 0) {
      ctx.url += '&__scene=' + encodeURIComponent(info.query.__scene);
    } else {
      ctx.url += '?__scene=' + encodeURIComponent(info.query.__scene);
    }
    let hasData = false;
    let data;
    try {
      data = urlmock(datadir, ctx);
      hasData = true;
    } catch (err) {
      // if mock data not exists, ignore it
      if (err.message.indexOf('Cannot find mock data file') === -1) {
        throw err;
      }
    }
    if (hasData) {
      ctx.set('x-koa-mock', true);
      return ctx.body = data;
    }

    ctx.set('x-koa-mock', false);
    await next();
  }
};

function defaultDetectAjax(ctx) {
  return ctx.get('X-Requested-With') === 'XMLHttpRequest';
}
