const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => ({
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].[chunkhash].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist', 'index.html'),
      template: path.resolve(__dirname, 'src', 'index.html'),
      title: 'Redux API Request'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'babel-preset-es2015',
            'babel-preset-react',
            'babel-preset-stage-0'
          ].map(require.resolve)
        }
      }
    ]
  }
})
