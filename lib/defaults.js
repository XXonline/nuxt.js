import _ from 'lodash'
import { join, resolve } from 'path'
import { existsSync } from 'fs'

export default function defaults (_options) {
  // Clone options to prevent unwanted side-effects
  const options = Object.assign({}, _options)

  // Normalize options
  if (options.loading === true) {
    delete options.loading
  }
  if (options.router && typeof options.router.middleware === 'string') {
    options.router.middleware = [options.router.middleware]
  }
  if (options.router && typeof options.router.base === 'string') {
    options._routerBaseSpecified = true
  }
  if (typeof options.transition === 'string') {
    options.transition = { name: options.transition }
  }

  // Apply defaults
  _.defaultsDeep(options, defaultOptions)

  // Resolve dirs
  options.rootDir = (typeof options.rootDir === 'string' && options.rootDir ? options.rootDir : process.cwd())
  options.srcDir = (typeof options.srcDir === 'string' && options.srcDir ? resolve(options.rootDir, options.srcDir) : options.rootDir)
  options.buildDir = join(options.rootDir, options.buildDir)

  // If app.html is defined, set the template path to the user template
  options.appTemplatePath = resolve(__dirname, 'views/app.template.html')
  if (existsSync(join(options.srcDir, 'app.html'))) {
    options.appTemplatePath = join(options.srcDir, 'app.html')
  }

  return options
}

const defaultOptions = {
  dev: (process.env.NODE_ENV !== 'production'),
  buildDir: '.nuxt',
  build: {
    analyze: false,
    extractCSS: false,
    publicPath: '/_nuxt/',
    filenames: {
      css: 'common.[chunkhash].css',
      manifest: 'manifest.[hash].js',
      vendor: 'vendor.bundle.[chunkhash].js',
      app: 'nuxt.bundle.[chunkhash].js'
    },
    vendor: [],
    loaders: [],
    plugins: [],
    babel: {},
    postcss: [],
    templates: [],
    watch: []
  },
  generate: {
    dir: 'dist',
    routes: [],
    interval: 0,
    minify: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeAttributeQuotes: false,
      removeComments: false,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: false,
      removeStyleLinkTypeAttributes: false,
      removeTagWhitespace: false,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
      useShortDoctype: true
    }
  },
  env: {},
  head: {
    meta: [],
    link: [],
    style: [],
    script: []
  },
  plugins: [],
  css: [],
  modules: [],
  layouts: {},
  serverMiddleware: [],
  ErrorPage: null,
  loading: {
    color: 'black',
    failedColor: 'red',
    height: '2px',
    duration: 5000
  },
  transition: {
    name: 'page',
    mode: 'out-in'
  },
  router: {
    mode: 'history',
    base: '/',
    routes: [],
    middleware: [],
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    extendRoutes: null,
    scrollBehavior: null
  },
  render: {
    ssr: {},
    http2: {
      push: false
    },
    static: {},
    gzip: {
      threshold: 0
    },
    etag: {
      weak: true // Faster for responses > 5KB
    }
  },
  watchers: {
    webpack: {},
    chokidar: {}
  }
}