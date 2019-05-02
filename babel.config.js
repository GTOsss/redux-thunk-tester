module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV);
  const isTest = api.env('test');

  const presets = [
    "@babel/preset-env",
    "@babel/preset-react"
  ];
  const plugins = [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties"
  ];

  return {
    presets,
    plugins,
    ignore: isTest ? undefined : ["**/*.test.js"],
  };
};