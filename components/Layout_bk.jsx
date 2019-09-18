// 全局布局
import { Layout, Icon, Input, Avatar } from 'antd'
import { useState, useCallback } from 'react'
const { Header, Content, Footer } = Layout

// header中 github图标Icon的样式,写在外面是这个style永远不会变, 以后组件渲染不用重新定义对象, 
// 保证了每次header组件中使用的组件github样式是同一个对象, 节省内存
const githubIconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20,
}
const footerStyle = {
  textAlign: 'center'
}

export default ({ children }) => {
  // 增加组件的状态, 因为涉及到用户的输入,进行查询仓库内容
  const [search, setSearch] = useState('')
  // 处理用户输入修改状态数据
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [setSearch])
  // antd中对Input.Search组件中onSearch的回调函数,用户在输入框中输入完成后, 处理用户点击搜索和回车
  const handleOnSearch = useCallback(() => {})
  return (
    <Layout>
      <Header>
        <div className="header-inner">
          <div className="header-left">
            <div>
              <Icon type="github" style={githubIconStyle}></Icon>
            </div>
            <div>
              <Input.Search placeholder="搜索仓库" value={search} onChange={ handleSearchChange } onSearch={ handleOnSearch } ></Input.Search>
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              <Avatar size = {40} icon="user" />
            </div>
          </div>
        </div>
      </Header>
      <Content>
        { children }
      </Content>
      <Footer style={footerStyle} >
        Develop by Zhicheng Liu @<a href="mailto:zhicheng.liu@cn.abb.com">Zhicheng.Liu@cn.abb.com</a>
      </Footer>
      <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
        }
      `}
      </style>
      {/* 全局样式设置 */}
      <style jsx global>
        {`
          #__next, .ant-layout {
            height: 100%;
          }
        `}
      </style>
    </Layout>
  )
}