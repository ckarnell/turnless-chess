require('webpack');
var DashboardPlugin = require('webpack-dashboard/plugin');

const config = {
  entry: __dirname + '/app.js',
  devtool: 'inline-source-map',
  plugins: [
    new DashboardPlugin(),
  ],
  // devServer: {
  //   contentBase: __dirname + '/dist',
  //   compress: true,
  //   port: 9000,
  // },
  output: {
    path: __dirname + '/dist', // Folder to store generated bundle
    filename: 'bundle.js', // Name of generated bundle after build
    publicPath: '/dist', // public URL of the output directory when referenced in a browser
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.css', '.html'],
  },
  module: {
    loaders: [
      {
        test: /\.scss/,
        loader: 'sass-loader',
      },
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
    rules: [
      {
        test: /\.scss/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(png|gif|jpeg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
};

module.exports = config;
