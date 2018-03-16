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
const path = require('path');
const Koa = require('koa');
const mock = require('../');
const app = require('./app');

describe('index.test.js', () => {
  let server;

  before(() => {
    server = app.listen();
  });
  after(() => {
    return server.close();
  });

  it('should render tpl with mock data', done => {
    request(server)
      .get('/?__scene')
      .expect('x-koa-mock', 'true')
      .expect(/iframe/)
      .expect(/fengmk2/, done);
  });

  it('should skip render when __skipRender=true', done => {
    request(server)
      .get('/?__scene=skipRender')
      .expect('x-koa-mock', 'true')
      .expect(/iframe/)
      .expect(/skip-render/, done);
  });

  it('should also inject when __scene is not specified', done => {
    request(server)
      .get('/users/1') // mocks/users/1/*
      .expect('x-koa-mock', 'false')
      .expect(/target_uri=\/users\/1/)
      .expect(/iframe/, done);
  });

  it('should render /users/1?__scene=fengmk2', done => {
    request(server)
      .get('/users/1?__scene=fengmk2')
      .expect('x-koa-mock', 'true')
      .expect(/<p>profile, fengmk2<\/p>/, done);
  });

  it('should return json when mock data without __view', done => {
    request(server)
      .get('/user?__scene=mk2')
      .expect('x-koa-mock', 'true')
      .expect({
        name: 'mk2'
      }, done);
  });

  it('should return json when mock data without __context', done => {
    request(server)
      .get('/users/1?__scene=popomore')
      .expect('x-koa-mock', 'true')
      .expect(/sessionId: 1234/, done);
  });

  it('should render html when ext not contains `.json`', done => {
    request(server)
      .get('/posts/123?__scene')
      .expect('x-koa-mock', 'true')
      .expect(/id: 123/, done);
  });

  it('should return json when ext contains `.json`', done => {
    request(server)
      .get('/posts/123.json?__scene')
      .expect('x-koa-mock', 'true')
      .expect({
        id: 123,
        __view: 'post.html'
      }, done);
  });

  it('should render page with scenes when querystring missing __scene', done => {
    request(server)
      .get('/')
      .expect('x-koa-mock', 'false')
      .expect(/<p>welcome home, <\/p>/)
      .expect(/iframe/)
      .expect(200, done);
  });

  it('should 500 when mock file not exists', done => {
    request(server)
      .get('/not-exists?__scene')
      .expect(500, done);
  });

  it('should render toolbox iframe', done => {
    request(server)
      .get('/__koa_mock_scene_toolbox')
      .expect('x-koa-mock', 'true')
      .expect('content-type', 'text/html; charset=utf-8')
      .expect(200, done);
  });

  it('should ignore buffer response', done => {
    request(server)
      .get('/buffer')
      .expect('x-koa-mock', 'false')
      .expect(200, done);
  });

  describe('ajax', () => {
    let server;

    before(() => {
      server = app.listen();
    });
    after(() => {
      return server.close();
    });

    it('should return mock data on ajax', done => {
      request(server)
        .get('/foo.json')
        .set('Referer', '/foo?__scene=other')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('x-koa-mock', 'true')
        .expect({
          foo: 'other'
        })
        .expect(200, done);
    });

    it('should return mock data with custom ajax detector', done => {
      const fixtures = path.join(__dirname, 'fixtures');
      const app = new Koa();

      app.use(mock({
        datadir: path.join(fixtures, 'mocks'),
        isAjax: ctx => {
          if (ctx.url.indexOf('.json') > 0) {
            return true;
          }
          return false;
        }
      }));

      const server = app.listen();

      request(server)
        .get('/foo.json')
        .set('Referer', '/foo?__scene=other')
        .expect('x-koa-mock', 'true')
        .expect({
          foo: 'other'
        })
        .expect(200, () => {
          server.close();
          done();
        });
    });

    it('should throw error on require mock data', done => {
      request(server)
        .get('/foo.json?u=1')
        .set('Referer', '/foo?__scene=error')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect(/Internal Server Error/)
        .expect(500, done);
    });

    it('should not return mock data on ajax', done => {
      request(server)
        .get('/foo.json?u=1')
        .set('Referer', '/foo?__scene=default')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('x-koa-mock', 'false')
        .expect({
          foo: 'bar'
        })
        .expect(200, done);
    });

    it('should not return mock data when missing referer', done => {
      request(server)
        .get('/foo.json')
        .set('X-Requested-With', 'XMLHttpRequest')
        .expect('x-koa-mock', 'false')
        .expect({
          foo: 'bar'
        })
        .expect(200, done);
    });

    it('should not return mock data when request is not ajax', done => {
      request(server)
        .get('/foo.json')
        .set('Referer', '/foo?__scene=other')
        .expect('x-koa-mock', 'false')
        .expect({
          foo: 'bar'
        })
        .expect(200, done);
    });
  });

  describe('options.documentDomain', () => {
    let server;
    const app = require('./document_domain');
    before(() => {
      server = app.listen();
    });

    after(() => {
      return server.close();
    });

    it('should render iframe with domain=localhost', done => {
      request(server)
        .get('/domain?__scene=default')
        .expect('x-koa-mock', 'true')
        .expect(/localhost/)
        .expect(/__koa_mock_scene_toolbox\?domain=localhost/)
        .expect(200, done);
    });

    it('should auto set iframe document domain', done => {
      request(server)
        .get('/__koa_mock_scene_toolbox?domain=localhost')
        .expect('x-koa-mock', 'true')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(/document\.domain = qs\.domain/)
        .expect(200, done);
    });

    it('should also inject when target_uri have value', done => {
      request(server)
        .get('/__koa_mock_scene_toolbox?target_uri=/users/1')
        .expect('x-koa-mock', 'true')
        .expect(/<script>window\.__koa_mock_scenes/)
        .expect(200, done);
    });
  });
});
