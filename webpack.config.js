const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './docs/main.js',

  output: {
    path: path.resolve(__dirname, './docs/build'),
    publicPath: 'docs/build/',
    filename: 'docs.js'
  },

  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.resolve(__dirname, './src')]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            less: 'vue-style-loader!css-loader!less-loader'
          }
        }
      },
      {
        test: /\.less$/,
        loader: ['vue-style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        loader: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: false
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.entry = './src/index.js';

  module.exports.output = {
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/',
    filename: 'e2-calendar.min.js',
    libraryTarget: 'umd'
  };

  module.exports.devtool = '#source-map';
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);

  if (process.env.NODE_ENV === 'production') {
    module.exports.externals = {
      'ant-design-vue': 'ant-design-vue'
    };
  }
  // 不打包 ant-design-vue/lib/select，项目中单独引用
  // module.exports.externals = { 'ant-design-vue/lib/select': 'ant-design-vue/lib/select' };
}
