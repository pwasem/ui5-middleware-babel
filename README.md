[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# ui5-middleware-http-proxy
Custom UI5 middleware extension for transpiling code using [babel](https://babeljs.io/) including caching.

For maximum flexibility no babel [configuration files](https://babeljs.io/docs/en/config-files) or [presets](https://babeljs.io/docs/en/presets) will be provided by the custom middleware.

Instead you have to manage your configuration and presets within your project according to your needs.

The task will simply call [babel.transformAsync](https://babeljs.io/docs/en/babel-core#transformasync) which will use your local [configuration files](https://babeljs.io/docs/en/config-files) for all your project's javascript resources.

## Prerequisites
Make sure your project is using the latest [UI5 Tooling](https://sap.github.io/ui5-tooling/pages/GettingStarted/).

## Getting started

### Install

#### Custom middleware
Add the custom middleware as a _devDependency_ to your project.

With `yarn`:
```sh
yarn add -D ui5-middleware-babel
```
Or `npm`:
```sh
npm i -D ui5-middleware-babel
```

Additionally the custom middleware needs to be manually defined as a _ui5 dependency_ in your project's `package.json`:
```json
{
  "ui5": {
    "dependencies": [
      "ui5-middleware-babel"
    ]
  }
}
```

### Configure

#### Custom middleware
Register the custom task in your project's `ui5.yaml`:
```yaml
server:
  customMiddleware:
    # babel
    - name: ui5-middleware-babel
      afterMiddleware: compression
      configuration:
        debug: true
        enabled: true
        excludes:
          - '/test/**'
          - '/localService/**'
```

### Additional configuration

#### Options
The custom middleware accepts the following configuration options

|   name   |   type   |                     description                    | mandatory | default |             examples             |
|:--------:|:--------:|:--------------------------------------------------:|:---------:|:-------:|:--------------------------------:|
|   debug  |  boolean |              enable/disable debug logs             |     no    | `false` |          `true`, `false`         |
|  enabled |  boolean |                   enable/disable                   |     no    |  `true` |          `true`, `false`         |
| excludes | string[] | list of files which should be transformed by babel |     no    |    []   | [`/test/**`, `/localService/**`] |
