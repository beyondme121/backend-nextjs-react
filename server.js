const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const next = require('next')
const auth = require('./server/auth')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// redis相关, 创建完成之后, 在session的store中设置使用redis保存session数据
const Redis = require('ioredis')
// 创建 redis client
const redis = new Redis()
const RedisSessionStore = require('./server/session-store')

app.prepare().then( () => {
  const server = new Koa()
  const router = new Router()
  // 处理session
  server.keys = ['hello world']
  const SESSION_CONFIG = {
    key: 'jid',
    // 可以设置session的过期时间, 比如10秒
    // maxAge: 30 * 1000, 
    store: new RedisSessionStore(redis) // 没有设置store的存储, session存储在客户端的cookies中
  }
  server.use(session(SESSION_CONFIG, server))
  auth(server)

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

  // 测试 其实不需要提供一个api接口, 然后再把session中的数据获取到
  router.get('/api/user/info', async (ctx, next) => {
    // 这个数据来自auth鉴权时, 通过github认证, 获取token, 再获取user信息
    const user = ctx.session.userInfo
    if (!user) {
      ctx.status = 401
      ctx.body = 'need login'
    } else {
      ctx.body = user
      ctx.set('Content-Type', 'application/json')
    }
  })

  server.use(router.routes())

  server.use(async ctx => {
    ctx.req.sessoin = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('server listening on 3000...')
  })
})



