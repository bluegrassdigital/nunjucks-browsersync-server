# nunjucks-browsersync-server

Easily create and configure a browser-sync + nunjucks server for serving static pages on the fly during template development

## Installation

`npm install nunjucks-browsersync-server`

## API

<a name="module_server"></a>

## server
Server module

<a name="module_server.start"></a>

### server.start(config)
Start a nunjucks-browsersync-server instance

**Kind**: static method of <code>[server](#module_server)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  |  |
| [config.staticPath] | <code>String</code> |  | A path containing static assets you want to serve along with your nunjucks pages |
| [config.basePort] | <code>Number</code> | <code>8020</code> | The port you want the server to start looking for available ports to serve on. The browser-sync ui server will start on the next port after the one that the server starts on |
| config.nunjucks | <code>Object</code> |  | An object of nunjucks configuration options |
| config.nunjucks.root | <code>string</code> |  | The root path where your nunjucks files are |
| config.nunjucks.renderPath | <code>string</code> |  | The folder name of the pages folder you want to render on the server. Is also used to match the urls under which you want nunjucks to render |
| [config.nunjucks.data] | <code>function</code> |  | A function returning the data you want to pass to the nunjucks templates |
| [config.nunjucks.globals] | <code>Object</code> |  | Any other nunjucks globals you want to add |
| [config.nunjucks.extension] | <code>string</code> | <code>&quot;&#x27;.njk&#x27;&quot;</code> | The extension to match for nunjucks files |
| [config.nunjucks.configureEnv] | <code>function</code> |  | A function that exposes the nunjucks environment instance in order to directly manipulate it if necessary |
| [config.browserSync] | <code>Object</code> |  | browser-sync configuration optiosn to mix with the defaults. See browser-sync docs. |

**Example**  
```js
// Imagine a directory structure// - assets// - html// -- pages// --- page-1.njk// -- layouts// -- partials// -- data.jsonvar server = require('nunjucks-browsersync-server')server.start({  staticPath: './assets',  browsersync: {    files: ['./assets/**', './html/**']  },  nunjucks: {    root: './html',    pages: 'pages',    globals: require('../nunjucks'),    data: require('./html/data.json')  }})// Now you can go to localhost:8020/pages/page-1.html and it will render the nunjucks page at './html/pages/page-1.njk' on the fly
```

## Contributing to nunjucks-browsersync-server

[Standard JS](http://standardjs.com/) applies

camelCase for function and variable names

[Github Flow](https://guides.github.com/introduction/flow/) - branch, submit pull requests

### Getting set up

- Pull the repo
- run `npm install`
- run `gulp` to build from `index.es6.js` to the compiled `index.js` file
