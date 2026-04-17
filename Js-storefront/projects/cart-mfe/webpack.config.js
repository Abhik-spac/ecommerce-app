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
    uniqueName: "cartMfe",
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
      name: "cartMfe",
      filename: "remoteEntry.js",
      exposes: {
        './CartRoutes': './projects/cart-mfe/src/lib/cart.routes.ts',
      },
      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/card": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/button": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/icon": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "rxjs": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ],
};
