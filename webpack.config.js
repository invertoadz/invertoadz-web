/**
 * Webpack main configuration file
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const environment = require('./configuration/environment');

const pages = [
  {
    name: 'index.handlebars',
    chunk: 'app',
    path: 'index.html',
  },
  // {
  //   name: 'provenance.handlebars',
  //   chunk: 'app',
  //   path: 'provenance.html',
  // },
  // {
  //   name: 'clubs.handlebars',
  //   chunk: 'app',
  //   path: 'clubs.html',
  // }
]

const htmlPluginEntries = pages.map((template) => new HTMLWebpackPlugin({
  inject: true,
  hash: false,
  filename: template.path,
  template: path.resolve(environment.paths.source, template.name),
  chunks: [template.chunk]
}));


module.exports = {
  entry: {
    app: path.resolve(environment.paths.source, 'js', 'app.js'),
  },
  output: {
    filename: 'js/[name].js',
    path: environment.paths.output,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      { test: /\.handlebars$/, loader: "handlebars-loader" },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'images/[name].[hash:6].[ext]',
              publicPath: '../',
              limit: environment.limits.images,
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'fonts/[name].[hash:6].[ext]',
              publicPath: '../',
              limit: environment.limits.fonts,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ['**/*', '!stats.json', '!.git', '!dist/.git/', '!.git/*'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(environment.paths.source, 'images'),
          to: path.resolve(environment.paths.output, 'images'),
          toType: 'dir',
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
        path.resolve(__dirname, "src", "CNAME"),
      ],
    }),
  ].concat(htmlPluginEntries),
  target: 'web',
};
