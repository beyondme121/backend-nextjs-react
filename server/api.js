// const github_base_url = 'https://api.github.com'
// const axios = require('axios')

const { requestGithub } = require('../lib/api')

// koa的中间件服务, 用于处理客户端发起的axios请求
// 从session中获取token, 拼接headers, 发送到github请求数据

module.exports = server => {
  server.use(async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method
    if (path.startsWith('/github/')) {
      // 处理headers
      const session = ctx.session
      const githubAuth = session && session.githubAuth
      const headers = {}
      if (githubAuth && githubAuth.access_token) {
        headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
      }
      // github实际的api可能是 /search/repositoies?q=react, koa做一次代理, 就要给添加一个标志标明是接口请求
      // 所以加上github, 但是实际向github发请求时, 要先将自定义的前缀去掉,ctx.url.replace('/github/', '/')
      // 这样github开放的api接口才是可以请求的
      const result = await requestGithub(
        method,
        ctx.url.replace('/github/', '/'),   
        ctx.request.fields || {},
        headers
      )
      // 把github返回给自己的server原封不动的返回给客户端 status data
      ctx.status = result.status
      ctx.body = result.data
    } else {
      await next()
    }
  })
}


// module.exports = server => {
//   server.use(async (ctx, next) => {
//     const path = ctx.path
//     if (path.startsWith('/github/')) {
//       const githubAuth = ctx.session.githubAuth
//       const githuPath = `${github_base_url}${ctx.url.replace('/github/', '/')}`
//       // 获取token
//       const token = githubAuth && githubAuth.access_token
//       let headers = {}
//       // 判断是否有token
//       if (token) {
//         headers['Authorization'] = `${githubAuth.token_type} ${token}`
//       }
//       try {
//         let result = await axios({
//           method: 'GET',
//           url: githuPath,
//           headers
//         })
//         if (result.status === 200) {
//           ctx.set('Content-Type', 'application/json')
//           ctx.body = result.data
//         } else {
//           ctx.set('Content-Type', 'application/json')
//           ctx.body = {
//             success: false,
//             msg: 'axios status is not 200'
//           }
//         }
//       } catch (error) {
//         console.log("error: ", error)
//         ctx.set('Content-Type', 'application/json')
//         ctx.body = {
//           success: false
//         }
//       }
//     } else {
//       await next()
//     }
//   })
// }
