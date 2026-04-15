const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, 'tsconfig.json'),
  ['@ecommerce/shared']
);

module.exports = {
  output: {
    uniqueName: "shell",
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
      library: { type: "module" },
      
      // Define remotes - other microfrontends this shell will load
      remotes: {
        "productMfe": "http://localhost:4201/remoteEntry.js",
        "cartMfe": "http://localhost:4202/remoteEntry.js",
        "checkoutMfe": "http://localhost:4203/remoteEntry.js",
        "orderMfe": "http://localhost:4204/remoteEntry.js",
        "authMfe": "http://localhost:4205/remoteEntry.js",
        "userMfe": "http://localhost:4206/remoteEntry.js",
      },
      
      // Shared dependencies
      shared: share({
        "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/button": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/card": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/icon": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/input": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/form-field": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/select": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/toolbar": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/menu": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/badge": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/divider": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/chips": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/tabs": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/stepper": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/material/progress-spinner": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "@angular/forms": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        "rxjs": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
        
        ...sharedMappings.getDescriptors()
      })
    }),
    sharedMappings.getPlugin()
  ],
};

// Made with Bob
