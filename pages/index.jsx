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
  maxAge: 1000 * 60 * 60
})

// 全局模块中定义缓存的数据变量
// let cachedUserRepos, cachedUserStarredRepos
const isServer = typeof window === 'undefined'

function Index({ userRepos, userStarredRepos, user, router }) {

  const tabKey = router.query.key || '1'
  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`)
  }

  // 使用useEffect 等同于类组件中的componentDidMount,Update, willUnmount\
  useEffect(() => {
    // 如果不是法服务端,即使浏览器环境, 才进行缓存
    if (!isServer) {
      if (userRepos) {
        cache.set('userRepos', userRepos)
      }
      if (userStarredRepos) {
        cache.set('userStarredRepos', userStarredRepos)
      }      
    }
  }, [userRepos, userStarredRepos])

  // 首页客户端缓存服务端渲染返回的数据
  useEffect(() => {
    if (!isServer) {
      // 如果未登录状态, userRepos是undefined, 所以cacheArray要进行判断否则就会报错
      cacheArray(userRepos)
      cacheArray(userStarredRepos)
    }
  })
  
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
 
  const user = reduxStore.getState().user
  
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  }
  // 方案1:公共变量的方式获取缓存数据
  // if (cachedUserRepos && cachedUserRepos) {
  //   return {
  //     userRepos: cachedUserRepos,
  //     userStarredRepos: cachedUserStarredRepos
  //   }
  // }

  if (cache.get('userRepos') && cache.get('userStarredRepos')) {
    console.log('cache, ', cache.get('userRepos'))
    return {
      userRepos: cache.get('userRepos'),
      userStarredRepos: cache.get('userStarredRepos')
    }
  }

  ///////////////// 前后端同构的处理, 调用同构处理过后的方法 api.request()

  // 1. 列出所有自己创建的仓库
  const userRepos = await api.request({
    url: '/user/repos',
  }, ctx.req, ctx.res)
  // 2. 列出自己关注的接口 (列出当前登录用户所关注的仓库 starred)
  const userStarredRepos = await api.request({
    url: '/user/starred'
  }, ctx.req, ctx.res)
  
  return {
    isLogin: true,
    userRepos: userRepos.data,
    userStarredRepos: userStarredRepos.data
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
export default withRouter(connect(mapStateToProps)(Index))

