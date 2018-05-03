// webpack基础配置
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    common: [
      'react',
      'react-dom',
    ],
    index: [
      "./src/mobx/src/App.jsx",
    ],
    mobx: [
      './src/mobx/test.js',
    ],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    sourceMapFilename: '[file].[chunkhash].map',
    crossOriginLoading: 'anonymous',
    publicPath: '',
  },
  plugins: [
    new webpack.DllPlugin({
      context: __dirname,
      name: "[name]_[hash]",
      path: path.join(__dirname, "manifest.json"),
    }),
    // new webpack.DllReferencePlugin({
    //   context: __dirname,
    //   manifest: require("../build/manifest.json"),
    //   name: "./dll.js",
    //   scope: "xyz",
    //   sourceType: "commonjs2"
    // }),
    new ExtractTextPlugin({
      filename: "[chunkhash:5].bundle.css",
      allChunks: true,
      disable: false,
    }),
    new CleanWebpackPlugin(['./dist'], {
      root: path.join(__dirname, '..'),
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
      template: './src/mobx/index.html',
    }),
  ],
  resolve: {
    extensions: ['.*', '.js', '.jsx', '.es6'],
    alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
      'prop-types': 'anujs/lib/ReactPropTypes',
      'create-react-class': 'anujs/lib/createClass',
      'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin'
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
        options: {
          failOnError: false,
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            "react",
            "es2015",
            "stage-2",
          ],
          plugins: [
            'transform-runtime',
            'transform-decorators-legacy',
            'transform-class-properties',
            'syntax-async-generators',
            ['transform-react-jsx', {
              "pragma": "React.createElement",
            }],
          ],
        },
      },
      // ts-node
      // https://webpack.js.org/configuration/configuration-languages/
      {
        test: /\.(tsx|ts)?$/,
        include: path.resolve(__dirname, "../src"),
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(le|c|sa)ss$/,
        use: ExtractTextPlugin.extract({
          use:[
            {
              loader: 'css-loader',
              options:{
                modules:true,
                importLoaders:1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            'less-loader',

            // css module + autoprefixer
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('autoprefixer')({
                    browsers: [
                      'Android >= 4.0',
                      'last 3 versions',
                      'iOS > 6'
                    ],
                  }),
                ],
              },
            },
          ],
          fallback: 'style-loader',
          publicPath: '/dist',
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ]
  }
}