const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then( () => {
  const server = new Koa()
  const router = new Router()
  // 处理session
  server.keys = ['hello world']
  const SESSION_CONFIG = {
    key: 'jid',
    // store: {}, // 没有设置store的存储, session存储在客户端的cookies中
  }
  server.use(session(SESSION_CONFIG, server))
  
  // 设置cookies
  // server.use(async (ctx, next) => {
  //   ctx.cookies.set('id', 'user:xxx', {
  //     httpOnly: false
  //   })
  //   await next()
  // })

  // 获取cookie的操作, 如果之前没有设置key的cookie, 第一次获取的就是undefined
  // server.use(async (ctx, next) => {
  //   const userCookies = ctx.cookies.get('id')
  //   // 根据cookies拿到用户的信息, 然后把用户信息交给session
  //   ctx.session = ctx.session || {}
  //   ctx.session.user = userCookies
  //   await next()
  // })

  router.get('/set/user', async (ctx, next) => {
    if (!ctx.session.user) {
      ctx.session.user = {
        username: 'sanfeng',
        age: 34
      }
    } else {
      console.log('koa-session set ctx a attr is ctx.session, ctx.session.user is ', ctx.session.user)
    }
    ctx.body = {}
  })
  server.use(router.routes())

  // next 集成 koa 进行服务端渲染 await handle(...)
  server.use(async (ctx, next) => {
    // console.log("ctx.session.user:", ctx.session.user)
    // await handle 表示已经写完了响应的结果给客户端了, koa-session做的最后异步是还要设置cookie, ctx.cookies.set(),
    // 处理完了响应并已经发给了客户端, 再设置影响的cookies就不对了
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('server listening on 3000...')
  })
})



