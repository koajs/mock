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
    .expect('<p>welcome home, fengmk2</p>\n', done);
  });

  it('should render /users/1?__scene=fengmk2', function (done) {
    request(app.listen())
    .get('/users/1?__scene=fengmk2')
    .expect('<p>profile, fengmk2</p>\n', done);
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

  it('should 404 when querystring missing __scene', function (done) {
    request(app.listen())
    .get('/')
    .expect(404, done);
  });
});
