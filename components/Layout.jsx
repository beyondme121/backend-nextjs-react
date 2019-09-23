import { withRouter } from 'next/router'
import Link from 'next/link'
import { useState, useCallback } from 'react'

// 获取配置文件信息
const { publicRuntimeConfig } = getConfig()
import getConfig from 'next/config'

// 数据store相关处理, action的引入
import { connect } from 'react-redux'
import { logout } from '../store/store'

// 公共组件 antd & 自定义组件
import { Layout, Input, Icon, Avatar, Tooltip, Dropdown, Menu } from 'antd'
const { Header, Content, Footer } = Layout
import Container from './Container'

// 第三方库
import axios from 'axios'

// 样式Icon
const githubIconStyle = {
  color: "#fff",
  fontSize: 40,
  paddingTop: 10,
  paddingRight: 20
}
const footerStyle = {
  textAlign: 'center'
}
// 实验: 定义一个组件, 把这个组件传递给Container组件(用于丰富传入组件的样式)
const Comp = ({ children, style }) => <div style={style}>{children}</div>


const MyLayout = ({ children, user, logout, router }) => {
  const urlQuery = router.query && router.query.query
  const [SearchText, setSearchText] = useState(urlQuery || '')
  const handleSearchTextChange = useCallback(
    e => setSearchText(e.target.value),
    [setSearchText]
  )
  // 搜索框查询事件, 查询结果, 路由跳转到search页面进行展示, 增加search.js
  const handleOnSearch = useCallback(
    () => {
      router.push(`/search?query=${SearchText}`)
      // console.log('hello world', SearchText);
      // console.log('根据searchText查询数据返回的结果', SearchText + 'liuzhicheng')
    }, [SearchText]
  )

  // 退出登录点击事件, 触发action, 修改state, 服务端清空session
  const handleLogout = useCallback(
    () => {
      logout()
    },
    [logout]    // 依赖logout这个props
  )

  // 发送接口请求, prepare-auth, 把url传递给后端server的中间件, 然后登录成功后redirect
  const handleGoToOAuth = useCallback((e) => {
    // 阻止a标签的默认行为
    e.preventDefault()
    // 这个请求的唯一目的是请求后端接口prepare-auth, 通过query的形式把url传递保存起来,然后端进行跳转redirect,
    // 前端依然去做登录认证的事OAUTH_URL
    axios.get(`/prepare-auth?url=${router.asPath}`).then(resp => {
      if (resp.status === 200) {
        location.href = `${publicRuntimeConfig.OAUTH_URL}`
      } else {
        console.log('login failed ', resp)
      }
    }).catch(err => console.log('login failed err', err))
  }, [])

  // 用户头像下拉框
  const userDropDown = (
    <Menu>
      <Menu.Item>
        <a href="javascript:void(0)" onClick={handleLogout}>注 销</a>
      </Menu.Item>
    </Menu>
  )
  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="logo">
              <Link href="/">
                <Icon type="github" style={githubIconStyle} />
              </Link>
            </div>
            <div>
              <Input.Search
                value={SearchText}
                placeholder="input Search text"
                onChange={handleSearchTextChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {
                // user通过react-redux的connect获取, 通过MyLayout的props进行传递
                user && user.id ?
                  (
                    <Dropdown overlay={userDropDown}>
                      <a href="/">
                        <Avatar size={40} src={user.avatar_url} />
                      </a>
                    </Dropdown>
                  ) : (
                    <Tooltip title="点击进行登录">
                      <a href={`/prepare-auth?url=${router.asPath}`} >
                        <Avatar size={40} icon="user" />
                      </a>
                    </Tooltip>
                  )
              }
            </div>
          </div>
        </Container>

      </Header>
      <Content>
        {/* 传入组件 */}
        <Container renderer={<Comp />}>
          {children}
        </Container>

        {/* <Container renderer={<Comp style={{color: 'red'}}/>}>
          { children }
        </Container> */}

        {/* 默认值的情况 使用container中的ES6的 renderer=<div /> */}
        {/* <Container>
          { children }
        </Container> */}

        {/* 传入jsx */}
        {/* <Container renderer={<div style={{ color: 'red' }} />} >
          {children}
        </Container> */}
      </Content>
      <Footer style={footerStyle}>
        Develop by Zhicheng Liu @
        <a href="mailto: Zhicheng.liu@cn.abb.com">Zhicheng.liu@cn.abb.com</a>
      </Footer>
      <style jsx>
        {`
          {/* 默认是一行横着排列, 祖先容器必须给一个justify-content */}
          .header-inner {
            display: flex;
            flex-direction: row; 
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            justify-content: flex-start;
          }
          
        `}
      </style>
      <style jsx global>
        {`
          #__next {
            height: 100%;
          }
          .ant-layout {
            min-height: 100%;
          }
          .ant-layout-header {
            padding-left: 0;
            padding-right: 0;
          }
          .ant-layout-content {
            background: #fff;
          }
        `}
      </style>
    </Layout>
  )
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
const mapActionToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  }
}
export default connect(mapStateToProps, mapActionToProps)(withRouter(MyLayout))