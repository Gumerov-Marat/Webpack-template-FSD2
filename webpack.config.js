const path = require('path');
const pug = require('pug')
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
//const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


const   isDev = process.env.NODE_ENV === 'development'
const   isProd = !isDev


const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`


const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      },
    },
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

module.exports = {
        context: path.resolve(__dirname, 'src'),
        mode: 'development',
        entry: './pages/index/index.js',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: filename('js')
        },
        optimization: optimization(),
          devServer: {
            port: 4200,
            hot: isDev
        },
        plugins:[
           new HTMLWebpackPlugin({
           template: './pages/index/index.pug',
           minify: {
            collapseWhitespace: isProd
           }
           }),
           new CleanWebpackPlugin(),
           new MiniCssExtractPlugin({
                filename: filename('css')
           })
           /*,
           new CopyWebpackPlugin([
                {
                   // from: path.resolve(__dirname, ''),
                   // to: path.resolve(__dirname, 'dist')
                }
           ])*/
        ],
        module: {
                rules: [
                {
                    test: /\.pug$/,
                    loader: 'pug-loader'
                },
                {
                    test: /\.css$/,
                    use: cssLoaders()
                },
                {
                    test: /\.(png|jpg|svg|gif)$/,
                    use: ['file-loader']
                },
                {
                  test: /\.s[as]ss$/,
                  use: cssLoaders('sass-loader')
                },
                {
                     test: /\.(ttf|woff|woff2|eot)$/,
                     use: ['file-loader']
                }
            ]
        }

}
