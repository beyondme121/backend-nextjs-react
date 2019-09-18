const withCSS = require('@zeit/next-css')

if (typeof require !== 'undefined') {
  require.extensions['css'] = file => {}
}

module.exports = withCSS({
  env: {
    customerKey: 'A0001',     // 页面使用process.env.customerKey获取
  },
  publicRuntimeConfig: {
    customerKey: 'A0002'
  }
})