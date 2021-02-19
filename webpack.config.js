const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.ts',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        use: ['file-loader']
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/scripts/components'),
      core: path.resolve(__dirname, './src/scripts/core'),
      actors: path.resolve(__dirname, './src/scripts/actors'),
      buildings: path.resolve(__dirname, './src/scripts/buildings'),
   }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env || 'development')
    }),
    new htmlWebpackPlugin({
        title: 'Strategy Game',
        template: './src/index.html',
    }),
    new CleanWebpackPlugin()
  ],
};