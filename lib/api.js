/**
 * 主要用于处理每个组件中的getInitialProps请求接口的函数, 也就是这个文件既要在客户端也要在服务端执行
 * 我们不能使用export语法,nodejs还不支持export
 */
const axios = require('axios')

const github_base_url = 'https://api.github.com'

// 请求github的数据
/**
 * 
 * @param {*} method 
 * @param {*} url 
 * @param {*} data 
 * @param {*} headers 
 */
async function requestGithub (method, url, data, headers) {
  console.log(`${github_base_url}${url}`, method, data, headers)
  return await axios({
    method,
    url: `${github_base_url}${url}`,    // 拼接github请求的真正的url, 带上域名
    data,
    headers
  })
}

const isServer = typeof window === 'undefined'

/**
 * 这个函数就要区别 客户端请求 还是 服务端请求 自动添加域名的处理
 * 服务端渲染添加本地80端口的域名 http://127.0.0.1/github/...
 * 客户端添加网站域名 http://localhost:3000/github/...
 * @param {} 传递给axios的配置参数, 也就是请求参数 
 * @param {*} req 
 * @param {*} res 
 */
async function request ({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('url must provide')
  }
  if (isServer) {
    // 如果是服务端渲染, 直接创建请求，请求github的数据
    // 1. 从session中获取access_token
    // 2. 把token拼接到headers上发起请求
    const session = req.session
    const githubAuth = session.githubAuth || {}
    let headers = {}
    if (githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }
    // console.log('服务端渲染调用...', headers, url)
    return await requestGithub(method, url, data, headers)
  } else {
    // 客户端请求, 需要加上/github的开发者约定的前缀, 以便koa中间件代理github请求时, 后端可以对这类特殊请求进行处理
    // 此处为什么不用传递headers? 因为headers是请求到api地址之后,从session里拿到token,然后拼接组合成headers
    // console.log('客户端调用...')
    return await axios({
      method,
      url: `/github${url}`,
      data
    })
  }
}

module.exports = {
  request,
  requestGithub
}