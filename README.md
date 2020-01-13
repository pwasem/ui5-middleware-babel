[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# ui5-middleware-babel
Custom UI5 middleware extension for transpiling code using [babel](https://babeljs.io/) including caching.

For maximum flexibility no babel [configuration files](https://babeljs.io/docs/en/config-files) or [presets](https://babeljs.io/docs/en/presets) will be provided by the custom middleware.

Instead you have to manage your configuration and presets within your project according to your needs.

The middleware will simply call [babel.transformAsync](https://babeljs.io/docs/en/babel-core#transformasync) which will use your local [configuration files](https://babeljs.io/docs/en/config-files) for all your project's javascript resources.

## Prerequisites
Make sure your project is using the latest [UI5 Tooling](https://sap.github.io/ui5-tooling/pages/GettingStarted/).

## Getting started

### Install

#### Custom middleware
Add the custom middleware and its peer dependencies as `devDependencies` to your project.

With `yarn`:
```sh
yarn add -D ui5-middleware-babel @babel/core
```
Or `npm`:
```sh
npm i -D ui5-middleware-babel @babel/core
```

Additionally the custom middleware needs to be manually defined in `ui5.dependencies` in your project's `package.json`:
```json
{
  "ui5": {
    "dependencies": [
      "ui5-middleware-babel"
    ]
  }
}
```

#### Babel presets
Add at least one babel [preset](https://babeljs.io/docs/en/presets) to your project's `devDependencies`, e.g. [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env).

With `yarn`:
```sh
yarn add -D @babel/preset-env
```
Or `npm`:
```sh
npm i -D @babel/preset-env
```

You can learn more about babel presets [here](https://babeljs.io/docs/en/presets).

### Configure

#### Custom middleware
Register the custom middleware in your project's `ui5.yaml`:
```yaml
server:
  customMiddleware:
    # babel
    - name: ui5-middleware-babel
      afterMiddleware: compression
      configuration:
        debug: true
        enabled: true,
        excludes:
          - '/test/**'
          - '/localService/**'
```

#### Babel config
Create a babel config file, e.g `babel.config.js` in your project's root directory:
```javascript
module.exports = api => {
  api.cache(true)
  const presets = [
    '@babel/preset-env'
  ]
  const plugins = []
  return {
    presets,
    plugins
  }
}
```
You can learn more about babel config files [here](https://babeljs.io/docs/en/config-files).

### Usage
Simply run `ui5 serve` to transpile your code on the fly when running your project.

### Additional configuration

#### Options
The custom middleware accepts the following configuration options

|   name   |   type   |                     description                        | mandatory | default |             examples             |
|:--------:|:--------:|:------------------------------------------------------:|:---------:|:-------:|:--------------------------------:|
|   debug  |  boolean |              enable/disable debug logs                 |     no    | `false` |          `true`, `false`         |
|  enabled |  boolean |                   enable/disable                       |     no    |  `true` |          `true`, `false`         |
| excludes | string[] | list of files which should not be transformed by babel |     no    |    []   | [`/test/**`, `/localService/**`] |

#### Browserlist
Consider adding a [browserlist](https://github.com/browserslist/browserslist) configuration to your project for controlling your target browsers. This configuration will [automatically be used by babel](https://babeljs.io/docs/en/babel-preset-env#browserslist-integration).

E.g. create a file `.browserslistrc` in your project's root directory:
```
> 0.25%
not dead
```

#### Polyfills
For adding required polyfills for ECMAScript features and transpiled generator functions to your app please see [ui5-shim-babel-polyfill](https://github.com/pwasem/ui5-shim-babel-polyfill).
