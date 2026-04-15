const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.json'),
  ['@ecommerce/shared']
);

module.exports = {
  output: {
    uniqueName: "b2bApp",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  experiments: {
    outputModule: true
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "b2bApp",
      filename: "remoteEntry.js",
      remotes: {
        productMfe: "http://localhost:4201/remoteEntry.js",
        cartMfe: "http://localhost:4202/remoteEntry.js",
        checkoutMfe: "http://localhost:4203/remoteEntry.js",
        orderMfe: "http://localhost:4204/remoteEntry.js",
        authMfe: "http://localhost:4205/remoteEntry.js",
        userMfe: "http://localhost:4206/remoteEntry.js"
      },
      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/toolbar": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/button": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/icon": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "rxjs": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ],
};
