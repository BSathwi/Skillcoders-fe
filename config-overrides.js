const webpack = require("webpack");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    vm: require.resolve("vm-browserify"),
    process: require.resolve("process/browser"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ];

  return config;
};