const path = require('path');
const webpack = require('webpack');




module.exports = {
  mode: 'development',
  entry: './client/components/app.jsx',

  output: {
    path: path.resolve(__dirname, 'client/public')
  },

  plugins: [new webpack.ProgressPlugin()],

  module: {
    rules: [{
      test: /\.js$|jsx/,
      include: [path.resolve(__dirname, 'client/components')],
      loader: 'babel-loader'
    }, {
      test: /.css$/,

      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",

        options: {
          sourceMap: true
        }
      }]
    }]
  }
}