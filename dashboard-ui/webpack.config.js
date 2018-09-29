const
   path = require('path'),
   HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
   new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['tbd'],
      favicon: './src/favicon.ico'
   })
];

module.exports = {
   entry: {
      tbd: './src/index.js'
   },
   output: {
      path: path.resolve('build'),
      filename: 'static/js/[name].[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js'
   },
   module: {
      loaders: [
         {
            test: /\.js$/,
            loaders: ['babel-loader', 'source-map-loader'],
            exclude: /node_modules/
         },
         {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
         },
         {
            test: /\.(eot|svg|ttf|woff|woff2)$/i,
            loader: 'file-loader',
            options: {
               outputPath: 'static/'
            }
         },
         {
            test: /\.(jpe?g|png|gif)$/i,
            loader: 'file-loader'
         }
      ]
   },
   plugins: plugins,
   devtool: 'source-map'
}
