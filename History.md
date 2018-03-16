
2.0.0 / 2018-03-16
==================

**fixes**
  * [[`f5e5b3f`](http://github.com/koajs/mock/commit/f5e5b3f3bfe445a674abb7b89e13113b7842dd53)] - fix: package.json to reduce vulnerabilities (snyk-bot <<admin+snyk-bot@snyk.io>>)

**others**
  * [[`09eefd4`](http://github.com/koajs/mock/commit/09eefd4cf4724f394cabf1d8779c539c6bf4952c)] - refactor: use async (#24) (hui <<kangpangpang@gmail.com>>)

1.6.2 / 2017-04-06
==================

  * fix: fixed request.query.hasOwnProperty call (#21)

1.6.1 / 2016-04-13
==================

  * fix: readFile output default is String (#19)

1.6.0 / 2016-04-12
==================

  * feat: scenes inject into __koa_mock_scene_toolbox html (#18)

1.5.1 / 2016-01-14
==================

  * fix: fix ie8 compatibility

1.5.0 / 2015-10-27
==================

 * feat: mock __context when it's a getter
 * use test-cov instead of test-travis

1.4.1 / 2015-08-31
==================

 * remove jquery && format

1.4.0 / 2015-08-26
==================

 * feat: support __skipRender

1.3.0 / 2015-07-07
==================

 * feat(context): Add __context that can mock app.context

1.2.1 / 2015-03-20
==================

 * Add response header

1.2.0 / 2015-03-20
==================

 * Changed select value as filename

1.1.4 / 2014-12-24
==================

 * fix: iframe set domain first

1.1.3 / 2014-12-24
==================

 * feat(ajax): auto read mock data on ajax request

1.1.2 / 2014-12-23
==================

 * fix dead loop on scene_toolbox.html

1.1.1 / 2014-12-23
==================

 * support IE

1.1.0 / 2014-12-09
==================

 * feat: support custom scene name using `__name`

1.0.6 / 2014-11-24
==================

 * support document.domain = $domain both on parent document and iframe document

1.0.5 / 2014-11-24
==================

 * fix: skip buffer response

1.0.4 / 2014-11-22
==================

 * iframe width 130px

1.0.3 / 2014-11-22
==================

 * also inject scene toolbox into normal page

1.0.2 / 2014-11-21
==================

 * support render return thunk and promise

1.0.1 / 2014-11-21
==================

 * feat: auto add scenes change toolbox

1.0.0 / 2014-11-20
==================

 * first commit
