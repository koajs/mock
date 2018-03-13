/**
 * koa-mock - test/index.test.js
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

const request = require('supertest');
const app = require('./app');

describe('index.test.js', () => {
  it('should render tpl with mock data', done => {
    request(app.listen())
      .get('/?__scene')
      .expect('<p>welcome home, fengmk2</p>\n', done);
  });

  it('should render /users/1?__scene=fengmk2', done => {
    request(app.listen())
      .get('/users/1?__scene=fengmk2')
      .expect('<p>profile, fengmk2</p>\n', done);
  });

  it('should return json when mock data without __view', done => {
    request(app.listen())
      .get('/user?__scene=mk2')
      .expect({
        name: 'mk2'
      }, done);
  });

  it('should render html when ext not contains `.json`', done => {
    request(app.listen())
      .get('/posts/123?__scene')
      .expect(/id: 123/, done);
  });

  it('should return json when ext contains `.json`', done => {
    request(app.listen())
      .get('/posts/123.json?__scene')
      .expect({
        id: 123,
        __view: 'post.html'
      }, done);
  });

  it('should 404 when querystring missing __scene', done => {
    request(app.listen())
      .get('/')
      .expect(404, done);
  });

  it('should 500 when mock file not exists', done => {
    request(app.listen())
      .get('/not-exists?__scene')
      .expect(500, done);
  });
});
