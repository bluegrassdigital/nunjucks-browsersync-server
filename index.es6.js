import express from 'express'
import nunjucks from 'nunjucks'
import compression from 'compression'
import browserSync from 'browser-sync'
import portfinder from 'portfinder'

/**
 * Server module
 * @module server
 */

const nunjuckDefaults = {
  root: null,
  renderPath: null,
  globals: {},
  extension: 'njk',
  configureEnv: () => true,
  data: () => {}
}

const defaultConfig = {
  staticPath: null,
  basePort: 8020,
  browserSync: {
    files: []
  }
}

/**
 * Start a nunjucks-browsersync-server instance
 *
 * @param {Object} config
 * @param {String} [config.staticPath] A path containing static assets you want to serve along with your nunjucks pages
 * @param {Number} [config.basePort=8020] The port you want the server to start looking for available ports to serve on. The browser-sync ui server will start on the next port after the one that the server starts on
 * @param {Object} config.nunjucks An object of nunjucks configuration options
 * @param {string} config.nunjucks.root The root path where your nunjucks files are
 * @param {string} config.nunjucks.renderPath The folder name of the pages folder you want to render on the server. Is also used to match the urls under which you want nunjucks to render
 * @param {function} [config.nunjucks.data] A function returning the data you want to pass to the nunjucks templates
 * @param {Object} [config.nunjucks.globals] Any other nunjucks globals you want to add
 * @param {string} [config.nunjucks.extension='.njk'] The extension to match for nunjucks files
 * @param {function} [config.nunjucks.configureEnv] A function that exposes the nunjucks environment instance in order to directly manipulate it if necessary
 * @param {Object} [config.browserSync] browser-sync configuration optiosn to mix with the defaults. See browser-sync docs.
 * @function
 * @example
 * // Imagine a directory structure
 * // - assets
 * // - html
 * // -- pages
 * // --- page-1.njk
 * // -- layouts
 * // -- partials
 * // -- data.json
 *
 * var server = require('nunjucks-browsersync-server')
 *
 * server.start({
 *   staticPath: './assets',
 *   browsersync: {
 *     files: ['./assets/**', './html/**']
 *   },
 *   nunjucks: {
 *     root: './html',
 *     renderPath: 'pages',
 *     globals: require('../nunjucks'),
 *     data: require('./html/data.json')
 *   }
 * })
 *
 * // Now you can go to localhost:8020/pages/page-1.html and it will render the nunjucks page at './html/pages/page-1.njk' on the fly
 */
export const start = (config = {}) => {
  config.nunjucks = {
    ...nunjuckDefaults,
    ...config.nunjucks
  }
  config = Object.assign({}, defaultConfig, config)
  if (!config.nunjucks.renderPath) return false
  const app = express()
  // Set up our express app
  app.use(compression())
  app.disable('view cache')

  if (config.staticPath) app.use(express.static(config.staticPath))

  const env = nunjucks.configure([config.nunjucks.root], {
    autoescape: false,
    express: app,
    watch: true,
    noCache: true
  })

  config.nunjucks.configureEnv(env)

  app.use((req, res, next) => {
    for (let item in config.nunjucks.globals) {
      if (!env.globals.hasOwnProperty(item) && config.nunjucks.globals.hasOwnProperty(item)) env.addGlobal(item, config.nunjucks.globals[item])
    }
    next()
  })

  app.get(`/${config.nunjucks.renderPath}/*`, (req, res, next) => {
    try {
      const data = typeof config.nunjucks.data === 'function' ? config.nunjucks.data() : config.nunjucks.data
      res.send(env.render(req.originalUrl.substr(1).replace('.html', config.nunjucks.extension), data))
    } catch (e) {
      console.log(e.message)
    }
  })

  const bs = browserSync.create()

  portfinder.basePort = config.basePort

  portfinder.getPort((err, port) => {
    if (err) {
      console.log(err.message)
    }
    app.set('port', port)
    // Kick start our server
    app.listen(app.get('port'))

    bs.init({
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
      logSnippet: false,
      ...config.browserSync
    })
  })
}
