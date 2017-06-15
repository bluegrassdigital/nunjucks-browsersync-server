// This is an entirely generated file, please do not modify it directly. Modify the source .es6.js file and run the gulp task'use strict';

exports.__esModule = true;
exports.start = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _browserSync = require('browser-sync');

var _browserSync2 = _interopRequireDefault(_browserSync);

var _portfinder = require('portfinder');

var _portfinder2 = _interopRequireDefault(_portfinder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nunjuckDefaults = {
  root: null,
  renderPath: null,
  globals: {},
  extension: 'njk',
  configureEnv: function configureEnv() {
    return true;
  },
  setupEnv: function setupEnv() {
    return true;
  },
  data: function data() {}
};

var defaultConfig = {
  staticPath: null,
  basePort: 8020,
  browserSync: {
    files: []
  }
};

var start = exports.start = function start() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  config.nunjucks = _extends({}, nunjuckDefaults, config.nunjucks);
  config = Object.assign({}, defaultConfig, config);
  if (!config.nunjucks.renderPath) return false;
  var app = (0, _express2.default)();

  app.use((0, _compression2.default)());
  app.disable('view cache');

  if (config.staticPath) app.use(_express2.default.static(config.staticPath));

  var env = _nunjucks2.default.configure([config.nunjucks.root], {
    autoescape: false,
    express: app,
    watch: true,
    noCache: true
  });

  config.nunjucks.configureEnv(env);
  config.nunjucks.setupEnv(env);

  app.use(function (req, res, next) {
    for (var item in config.nunjucks.globals) {
      if (!env.globals.hasOwnProperty(item) && config.nunjucks.globals.hasOwnProperty(item)) env.addGlobal(item, config.nunjucks.globals[item]);
    }
    next();
  });

  app.get('/' + config.nunjucks.renderPath + '/*', function (req, res, next) {
    try {
      var data = typeof config.nunjucks.data === 'function' ? config.nunjucks.data() : config.nunjucks.data;
      res.send(env.render(req.originalUrl.substr(1).replace('.html', config.nunjucks.extension), data));
    } catch (e) {
      console.log(e.message);
    }
  });

  var bs = _browserSync2.default.create();

  _portfinder2.default.basePort = config.basePort;

  _portfinder2.default.getPort(function (err, port) {
    if (err) {
      console.log(err.message);
    }
    app.set('port', port);

    app.listen(app.get('port'));

    bs.init(_extends({
      proxy: 'http://localhost:' + app.get('port'),
      port: app.get('port') + 1,
      ui: {
        port: app.get('port') + 2
      },
      ghostMode: {
        clicks: false,
        forms: true,
        scroll: false
      },
      logSnippet: false
    }, config.browserSync));
  });
};