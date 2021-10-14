/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { extendDefaultPlugins } = require('svgo');
const Dotenv = require('dotenv-webpack');
const webpackConfiguration = require('../webpack.config');

module.exports = merge(webpackConfiguration, {
  mode: 'production',

  /* Manage source maps generation process. Refer to https://webpack.js.org/configuration/devtool/#production */
  devtool: false,

  /* Optimization configuration */
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new CssMinimizerPlugin(),
    ],
  },

  /* Performance treshold configuration values */
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  /* Additional plugins configuration */
  plugins: [
    new ImageMinimizerPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: extendDefaultPlugins([
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ]),
            },
          ],
        ],
      },
    }),
    new Dotenv({
      path: `./.env.production`
    }),
  ],
});
