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
var path = require('path');
var fs = require('fs');

var IS_JSON_RE = /\.json$/;

module.exports = function (options) {
  var datadir = options.datadir;
  var documentDomain = options.documentDomain || '';

  return function* mock(next) {
    if (this.path === '/__koa_mock_scence_toolbox') {
      this.type = 'html';
      return this.body = fs.createReadStream(path.join(__dirname, 'scene_toolbox.html'));
    }

    if (!this.query.hasOwnProperty('__scene')) {
      yield* next;
      inject(this);
      return;
    }

    var data = urlmock(datadir, this.url);
    var view = data.__view;
    debug('mock %s => %j, view: %s', this.url, data, view);
    if (!view || IS_JSON_RE.test(this.path)) {
      return this.body = data;
    }

    yield this.render(view, data);

    inject(this);
  };

  function inject(ctx) {
    if (!ctx.response.is(['html']) || typeof ctx.body !== 'string') {
      return;
    }

    // add scene toolbox iframe
    var scenes = urlmock.findAllScenes(datadir, ctx.url);
    var iframe = '<iframe src="/__koa_mock_scence_toolbox?scenes=' + scenes.map(encodeURIComponent).join(',') +
      '&domain=' + encodeURIComponent(documentDomain) + '" \
      style="width: 130px; position: fixed; right: 0; border: 0; bottom: 0; margin: 0; padding: 0; height: 28px; z-index: 99998;">\
      </iframe></body>';
    debug('inject %s with scenes: %j', ctx.url, scenes);
    ctx.body = ctx.body.replace(/<\/body>/, iframe);
  }
};
