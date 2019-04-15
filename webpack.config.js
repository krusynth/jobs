const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const path = require('path');
// const NodemonPlugin = require('nodemon-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // production
  entry: [
    '@babel/polyfill',
    'index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.css$/, use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
          {
            loader: 'css-loader',
            options: {
              url: false,
              minimize: true,
              sourceMap: true
            }
          },
          { loader: "sass-loader"}
          ]
        })
      },
      //  {  // I can't get this to work. #FAIL
      //   test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/i,
      //   use: [{
      //     loader: 'file-loader'
      //     options: {
      //       name: '[name].[ext]',
      //       outputPath: 'fonts/',
      //       publicPath: '/'
      //     }
      //   }]
      // },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=images/[name].[ext]',
          'image-webpack-loader?bypassOnDebug'
        ]
      }
    ]
  },
  resolve: {
    modules: [
    path.resolve('frontend'),
    path.resolve('assets'),
    path.resolve('node_modules')
    ]
  },
  plugins: [
    // new NodemonPlugin(),
    new ExtractTextPlugin("css/styles.css"),
    new CopyWebpackPlugin([
      { from: './assets/fonts', to: './fonts/', flatten:true },
      { from: './assets/images', to: './images/', flatten: false }
    ])
  ],
  devtool: 'source-map'
};
