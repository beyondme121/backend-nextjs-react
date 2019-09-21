const axios = require('axios')
const config = require('../config')

const { client_id, client_secret, request_token_url } = config.github

// 处理auth 路径
module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const code = ctx.query.code
      if (!code) {
        ctx.body = 'code is not exist'
        return
      }
      // 根据client_id, client_secret, code 发送POST请求获取token
      const result = await axios({
        url: request_token_url,
        method: 'POST',
        data: {
          client_id,
          client_secret,
          code
        },
        headers: {
          Accept: 'application/json'
        }
      })
      console.log("result: ", result.status, result.data)
      // 由于github 在第一次点击认证之后,再次刷新或请求带有code的url时, 由于code只能使用一次, 
      // 所以github会返回错误 error: 'bad_verification_code', 所以不仅要判断相应码,还要判断
      // result.data 以及result.data.error是否存在
      if (result.status === 200 && !(result.data && result.data.error)) {
        // 接下来可以请求github的数据了, 根据token获取用户的数据, 通过GITHUB的API
        // 获取token
        // console.log('==================================================')
        const { access_token, token_type } = result.data
        // 根据token请求用户信息 或者其他信息
        const userInfoResp = await axios({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`
          }
        })
        // console.log(userInfoResp.data)
        ctx.session.userInfo = userInfoResp.data
        // 如果session中保存的urlBeforeOAuth存在, 就直接跳转回原来的地址, 否则就回根目录
        ctx.redirect((ctx.session && ctx.session.urlBeforeOAuth) || '/')
        // 还要清空urlBeforeOAuth, 因为登录成功后, 当前次的认证已经完成, 不用再跳会原来的路径
        ctx.session.urlBeforeOAuth = ''
      } else {
        // 如果不是200 或者 使用了多次code, 都无法验证通过
        const errorMsg = result.data && result.data.error
        ctx.body = `request token failed ${errorMsg}`
      }
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    if (ctx.path === '/logout' && ctx.method === 'POST') {
      ctx.session = null
      ctx.body = `logout success`
    } else {
      await next()
    }
  })

  // 处理登录成功跳转回原来的页面
  server.use(async (ctx, next) => {
    if (ctx.path === '/prepare-auth' && ctx.method === 'GET') {
      // 在登录请求之前记录的url
      const { url } = ctx.query
      ctx.session.urlBeforeOAuth = url
      // 比如加上ctx.body = {...},以为如果不加, /prepare-auth?url=/details 这个请求resp就是404
      ctx.body = {}
    } else {
      await next()
    }
  })
}