var webpack = require('atool-build/lib/webpack');

module.exports = function(webpackConfig) {
  // common
  webpackConfig.plugins.some(function(plugin, i){
    if(plugin instanceof webpack.optimize.CommonsChunkPlugin || plugin.constructor.name === 'CommonsChunkPlugin') {
      webpackConfig.plugins.splice(i, 1);
      return true;
    }
  });
  // atpl loader
  webpackConfig.module.loaders.push({
    test: /\.atpl?$/,
    loader: 'atpl-loader',
  });
  // zepto
  webpackConfig.module.loaders.push({
    test: require.resolve('zepto'),
    loader: 'exports-loader?window.Zepto!script-loader'
  });
  // 返回 webpack 配置对象
  return webpackConfig;
};