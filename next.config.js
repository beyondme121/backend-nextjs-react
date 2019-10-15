const webpack = require('webpack')
const withCSS = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const config = require('./config')
if (typeof require !== 'undefined') {
  require.extensions['css'] = file => {}
}

// GITHUB 认证地址, 点击授权返回code
// const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
// const SCOPE = 'user'

module.exports = withBundleAnalyzer(withCSS({
  webpack (config) {
    // 忽略所有和locale相关的js文件
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    return config
  },
  // env: {
  //   customerKey: 'A0001',     // 页面使用process.env.customerKey获取
  // },
  // publicRuntimeConfig: {
  //   GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
  //   OAUTH_URL: config.OAUTH_URL
  // }
  // 使用webpack的analyzer的分析插件,帮助分析打包出来的js的依赖关系
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    // 生成的分析报告产出在什么目录未知
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html'
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html'
    },
  }
}))