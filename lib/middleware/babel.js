const minimatch = require('minimatch')
const babel = require('@babel/core')
const log = require('@ui5/logger').getLogger('ui5-middleware-babel')

const respond = (res, code) => res.type('.js').end(code)
const wrapCode = code => `(function() {\n'use strict';\n\n${code}\n})()`

/**
 * Custom UI5 Server middleware for transpiling resources using babel including caching
 *
 * @param {Object} parameters Parameters
 * @param {Object} parameters.resources Resource collections
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.all Reader or Collection to read resources of the
 *                                        root project and its dependencies
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.rootProject Reader or Collection to read resources of
 *                                        the project the server is started in
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.dependencies Reader or Collection to read resources of
 *                                        the projects dependencies
 * @param {Object} parameters.options Options
 * @param {string} [parameters.options.configuration] Custom server middleware configuration if given in ui5.yaml
 * @returns {function} Middleware function to use
 */
module.exports = function ({ resources, options }) {
  const { rootProject } = resources
  const { debug = false, enabled = true, wrap = true, excludes = [], matchBase = false } = options.configuration || {}

  const cache = new Map()

  return async (req, res, next) => {
    if (!enabled) {
      return next()
    }
    const { path } = req
    if (!path || !path.endsWith('.js')) {
      return next()
    }
    const excluded = excludes.some(pattern => minimatch(path, pattern, { matchBase }))
    if (excluded) {
      debug && log.info(`Excluding file: ${path}`)
      return next()
    }
    const resource = await rootProject.byPath(path)
    if (!resource) {
      // e.g. /Component-preload.js
      return next()
    }
    // get stats
    const { ctimeMs: timestamp } = resource.getStatInfo()
    // respond from cache?
    const cached = cache.get(path)
    if (cached && (cached.timestamp === timestamp)) {
      debug && log.info(`Using cache for file: ${path}`)
      // respond with cached code
      return respond(res, cached.code)
    }
    // transform content
    debug && log.info(`Transforming file: ${path}`)
    const content = await resource.getString()
    const transformed = await babel.transformAsync(content, {
      filename: path,
      sourceMaps: 'inline'
    })
    // fill / update cache
    cache.set(path, {
      timestamp,
      code: transformed.code
    })
    // respond with transformed code
    return respond(res, wrap ? wrapCode(transformed.code) : transformed.code)
  }
}
