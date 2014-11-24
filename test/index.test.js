/**!
 * koa-mock - test/index.test.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var request = require('supertest');
var app = require('./app');

describe('index.test.js', function () {
  it('should render tpl with mock data', function (done) {
    request(app.listen())
    .get('/?__scene')
    .expect(/iframe/)
    .expect(/fengmk2/, done);
  });

  it('should render /users/1?__scene=fengmk2', function (done) {
    request(app.listen())
    .get('/users/1?__scene=fengmk2')
    .expect(/<p>profile, fengmk2<\/p>/, done);
  });

  it('should return json when mock data without __view', function (done) {
    request(app.listen())
    .get('/user?__scene=mk2')
    .expect({
      name: 'mk2'
    }, done);
  });

  it('should render html when ext not contains `.json`', function (done) {
    request(app.listen())
    .get('/posts/123?__scene')
    .expect(/id: 123/, done);
  });

  it('should return json when ext contains `.json`', function (done) {
    request(app.listen())
    .get('/posts/123.json?__scene')
    .expect({
      id: 123,
      __view: 'post.html'
    }, done);
  });

  it('should render page with scenes when querystring missing __scene', function (done) {
    request(app.listen())
    .get('/')
    .expect(/<p>welcome home, <\/p>/)
    .expect(/iframe/)
    .expect(200, done);
  });

  it('should 500 when mock file not exists', function (done) {
    request(app.listen())
    .get('/not-exists?__scene')
    .expect(500, done);
  });

  it('should render toolbox iframe', function (done) {
    request(app.listen())
    .get('/__koa_mock_scence_toolbox')
    .expect('content-type', 'text/html; charset=utf-8')
    .expect(200, done);
  });

  it('should ignore buffer response', function (done) {
    request(app.listen())
    .get('/buffer')
    .expect(200, done);
  });

  describe('options.documentDomain', function () {
    var app = require('./document_domain');

    it('should render iframe with domain=localhost', function (done) {
      request(app.listen())
      .get('/domain?__scene=default')
      .expect(/localhost/)
      .expect(/&domain=localhost/)
      .expect(200, done);
    });

    it('should auto set iframe document domain', function (done) {
      request(app.listen())
      .get('/__koa_mock_scence_toolbox?domain=localhost')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(/document\.domain = qs\.domain/)
      .expect(200, done);
    });
  });
});
