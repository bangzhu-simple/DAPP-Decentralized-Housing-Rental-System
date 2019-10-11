const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('dotenv').config()

module.exports = {
  entry: {
    app: './app/ui/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './app/img', to: "img" }
    ]),
    new webpack.DefinePlugin({

      IPFS_API_HOST: JSON.stringify(process.env.IPFS_API_HOST),
      IPFS_API_PORT: JSON.stringify(process.env.IPFS_API_PORT),
      IPFS_GATEWAY_URL: JSON.stringify(process.env.IPFS_GATEWAY_URL),
      ARBITRATOR: JSON.stringify(process.env.ARBITRATOR),
      CITIES: JSON.stringify(process.env.CITIES),
      CITY: JSON.stringify(process.env.CITY)
    })
  ],
  module: {
    rules: [
      {
       test: /\.css$/,
       use: [ 'style-loader', 'css-loader' ]
      }
    ],
    loaders: [
      { test: /\.json$/, use: 'json-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  resolve:{
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
}
