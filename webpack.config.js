const webpack = require('webpack');
const TypedocWebpackPlugin = require('typedoc-webpack-plugin');

const env = process.env.NODE_ENV;

module.exports = {
  mode: env === 'production' ? 'production' : 'development',
  externals: {
    'stringify-object': {
      root: 'stringify-object',
      commonjs: 'stringify-object',
      commonjs2: 'stringify-object',
      amd: 'stringify-object',
    },
    'colors/safe': {
      root: 'colors/safe',
      commonjs: 'colors/safe',
      commonjs2: 'colors/safe',
      amd: 'colors/safe',
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
        exclude: /node_modules/,
      }
    ]
  },
  output: {
    library: 'ReduxThunkTester',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new TypedocWebpackPlugin({
      out: './docs',
      module: 'commonjs',
      target: 'es6',
    }),
  ]
};
