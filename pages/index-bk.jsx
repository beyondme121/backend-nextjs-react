import config from '../config'
import Router, { withRouter } from 'next/router'
import { Button, Icon, Tabs } from 'antd'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import LRU from 'lru-cache'
import { cacheArray } from '../lib/repo-basic-cache'

const api = require('../lib/api')

// 引入自定义组件
import Repo from '../components/Repo'

const cache = new LRU({
  maxAge: 1000 * 60 * 10
})

// 全局模块中定义缓存的数据变量
let cachedUserRepos, cachedUserStarredRepos
const isServer = typeof window === 'undefined'

function Index({ userRepos, userStarredRepos, user, router }) {


  // 如果router中的query中有key, 就使用, 否则就使用默认的key=1, 把这个tabKey作为Tabs的activeKey
  // const tabKey = router.query.key || '1'
  // const handleTabChange = (selectKey) => {
  //   // 将当前的Tab的key设置到路由上, 点击某个tab, 就会路由设置为http://localhost:3000/?query=1,2,3...
  //   // 路由是history的, 当你访问/detail之后再回退时, url的路径就是http://localhost:3000/?query=2
  //   // 此时访问的是Index, 由detail跳转回Index, 所以程序从上向下执行, 就会获取tabKey
  //   Router.push(`/?key=${selectKey}`)
  // }

  const tabKey = router.query.key || '1'
  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`)
  }

  // 组件内可以有多个useEffect, 关注点分离
  useEffect(() => {
    if (!isServer) {
      cachedUserRepos = userRepos
      cachedUserStarredRepos = userStarredRepos
      // if (userRepos) {
      //   cache.set('userRepos', userRepos)
      // }
      // if (userStarredRepos) {
      //   cache.set('userStarredRepos', userStarredRepos)
      // }
      const timeout = setTimeout(() => {
        cachedUserRepos = null
        cachedUserStarredRepos = null
      }, 1000 * 60 * 60)
    }
  }, [userRepos, userStarredRepos])

  // 缓存repos
  useEffect(() => {
    if (!isServer) {
      cacheArray(userRepos)
      cacheArray(userStarredRepos)
      // if (userRepos !== 'undefined' && userStarredRepos !== 'undefined') {
      //   console.log("-----------",userRepos)
      //   cacheArray(userRepos)
      //   cacheArray(userStarredRepos)
      // }
    }
  })
  
  // 不能使用传入的isLogin, 要使用store中的, store中的数据发生变化, 会触发组件的重新渲染
  if (!user || !user.id) {
    return <div className="root">
      <p>亲，您还没有登录</p>
      <Button type="primary" href={config.OAUTH_URL} >点击登录</Button>
      <style jsx>
        {`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}
      </style>
    </div>
  }
  

  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <Icon type="mail" style={{ marginRight: 10 }} />
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey} onChange = { handleTabChange }>
          <Tabs.TabPane tab="你的仓库" key="1">
            {userRepos.map(repo => (
              <Repo repo={repo} key={repo.id}/>
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            {userStarredRepos.map(repo => (
              <Repo repo = {repo} key={repo.id}/>
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>

      <style jsx>
        {`
          .root {
            display: flex;
            align-items: flex-start;
            padding: 10px 0;
          }
          .user-info {
            width: 200px;
            margin-right: 40px;
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
          }
          .login {
            font-weight: 800;
            font-size: 20px;
            margin-top: 20px;
          }
          .name {
            font-size: 16px;
            color: #777;
          }
          .bio {
            margin-top: 20px;
            color: #333;
          }
          .avatar {
            width: 100%;
            border-radius: 5px;
          }
          {/* 扩展将右侧整体伸开 */}
          .user-repos {
            flex-grow: 1;
          }
      `}
      </style>
    </div>
  )
}

Index.getInitialProps = async ({ ctx, reduxStore }) => {
  ///////////////// 前端请求方式, 服务端渲染无法匹配
  // const result = await Axios
  //   .get('/github/search/repositories?q=react')
  //   .then(res => console.log(res))
  // 组件中只需要用request, 因为这个函数已经处理了是客户端还是服务端发起的请求
  console.log('in getInitialProps...')
  const user = reduxStore.getState().user
  console.log('in getInitialProps... user:', user)
  
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  }

  ///////////////// 前后端同构的处理, 调用同构处理过后的方法 api.request()
  // 只会在服务端渲染的时候才会使用req, 从req中拿到session
  // const searchResult = await api.request({
  //   url: '/search/repositories?q=react'
  // }, ctx.req, ctx.res)

  // 请求接口前, 看看是否有缓存数据, 如果有就直接使用缓存, 没有才请求数据
  // if (!isServer) {
  //   if (cachedUserRepos && cachedUserStarredRepos) {
  //     console.log('in cachedUserRepos....')
  //     return {
  //       userRepos: cachedUserRepos,
  //       userStarredRepos: cachedUserStarredRepos
  //     }
  //   } else {
  //     console.log('initial cached')
  //   }
  // }
  if (!isServer) {
    if (cache.get('userRepos') && cache.get('userStarredRepos')) {
      return {
        userRepos: cache.get('userRepos'),
        userStarredRepos: cache.get('userStarredRepos')
      }
    }
  }


  //////////////////////// 首页请求的接口 ////////////////////////
  // 1. 列出所有自己创建的仓库
  const userRepos = await api.request({
    url: '/user/repos',
  }, ctx.req, ctx.res)
  console.log("userRepos", userRepos)
  // 2. 列出自己关注的接口 (列出当前登录用户所关注的仓库 starred)
  const userStarredRepos = await api.request({
    url: '/user/starred'
  }, ctx.req, ctx.res)
  
  // 向后端请求完数据, 把数据存储在缓存中(保存到一个变量中),然后判断这个变量是否为空, 为空就请求数据, 不为空就直接使用之前请求的数据
  
  // if (!isServer) {
  //   cachedUserRepos = userRepos.data
  //   cachedUserStarredRepos = userStarredRepos.data
  // }

  return {
    isLogin: true,
    userRepos: userRepos.data,
    userStarredRepos: userStarredRepos.data,
    // searchResult: searchResult.data
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default withRouter(connect(mapStateToProps)(Index))

