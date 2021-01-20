const path = require('path')
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const TerserPlugin = require('terser-webpack-plugin')
function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      minimizer: [
          new TerserPlugin({
              terserOptions: {
                  compress: { drop_console: true }
              }
          })
      ]
    },
    resolve: {
      extensions: ['.js', '.json', '.vue']
    },
    plugins: [
      //new BundleAnalyzerPlugin()
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]', 
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    entry: [
      'babel-polyfill',
      './src/main.js',
    ],
    externals: {
      'vue': 'Vue',
      'Router':  'VueRouter',
      'ElementUI': 'ELEMENT',
      'axios': 'axios'
    },
    devtool: 'inline-source-map',  // 加上对应的配置
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            resolve('src'),
            //resolve('node_modules/echarts'),
            resolve('node_modules/webpack-dev-server/client'),
          ]
        }
      ]
    },
  }
};