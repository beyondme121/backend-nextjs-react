const withCSS = require('@zeit/next-css')
const config = require('./config')
if (typeof require !== 'undefined') {
  require.extensions['css'] = file => {}
}

// GITHUB 认证地址, 点击授权返回code
// const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
// const SCOPE = 'user'

module.exports = withCSS({
  env: {
    customerKey: 'A0001',     // 页面使用process.env.customerKey获取
  },
  // publicRuntimeConfig: {
  //   GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
  //   OAUTH_URL: config.OAUTH_URL
  // }
})