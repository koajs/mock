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
var urlparse = require('url').parse;
var path = require('path');
var fs = require('fs');

var IS_JSON_RE = /\.json$/;

module.exports = function (options) {
  var datadir = options.datadir;
  var documentDomain = options.documentDomain || '';
  var isAjax = options.isAjax || defaultDetectAjax;

  return function* mock(next) {
    if (this.path === '/__koa_mock_scene_toolbox') {
      this.type = 'html';
      this.set('x-koa-mock', true);
      var targetUri = urlparse(this.href, true).query.target_uri;
      if (targetUri) {
        var scenes = urlmock.findAllScenes(datadir, targetUri);
        var body = fs.readFileSync(path.join(__dirname, 'scene_toolbox.html'));
        return this.body = body.replace(/<\/select>/, '<script>window.__koa_mock_scenes=' + JSON.stringify(scenes) + '</script>');
      } else {
        return this.body = fs.createReadStream(path.join(__dirname, 'scene_toolbox.html'));
      }
    }

    if (!this.query.hasOwnProperty('__scene')) {
      var referer = this.get('referer');
      if (referer && referer.indexOf('__scene=') > 0 && isAjax(this)) {
        return yield* mockAjax(this, next);
      }
      this.set('x-koa-mock', false);
      yield* next;
      inject(this);
      return;
    }

    this.set('x-koa-mock', true);

    var data = urlmock(datadir, this);
    var context = data.__context || {};
    for (var key in context) {
      if (this.hasOwnProperty(key)) {
        delete this[key];
      }
      Object.defineProperty(this, key, {
        writable: true,
        configurable: true,
        enumerable: true,
        value: context[key]
      });
    }

    if (data.__skipRender) {
      yield* next;
    } else {
      var view = data.__view;
      debug('mock %s => %j, view: %s', this.url, data, view);
      if (!view || IS_JSON_RE.test(this.path)) {
        return this.body = data;
      }
      yield this.render(view, data);
    }
    inject(this);
  };

  function inject(ctx) {
    if (!ctx.response.is(['html']) || typeof ctx.body !== 'string') {
      return;
    }

    // add scene toolbox iframe
    var iframe = '<iframe src="/__koa_mock_scene_toolbox?domain=' + encodeURIComponent(documentDomain) +
      '&target_uri=' + ctx.url +
      '" style="position: fixed; right: 0; border: 0; bottom: 10px; margin: 0; padding: 0; height: 30px; z-index: 99998;">\
      </iframe></body>';
    debug('inject %s', ctx.url);
    ctx.body = ctx.body.replace(/<\/body>/, iframe);
  }

  function* mockAjax(ctx, next) {
    var info = urlparse(ctx.get('referer'), true);
    if (ctx.url.indexOf('?') > 0) {
      ctx.url += '&__scene=' + encodeURIComponent(info.query.__scene);
    } else {
      ctx.url += '?__scene=' + encodeURIComponent(info.query.__scene);
    }
    var hasData = false;
    var data;
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
    yield* next;
  }
};

function defaultDetectAjax(ctx) {
  return ctx.get('X-Requested-With') === 'XMLHttpRequest';
}
