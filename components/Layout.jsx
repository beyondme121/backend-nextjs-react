import { useState, useCallback } from 'react'
import { Layout, Input, Icon, Avatar } from 'antd'
const { Header, Content, Footer } = Layout
import Container from './Container'
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

export default ({ children }) => {
  const [SearchText, setSearchText] = useState('')
  const handleSearchTextChange = useCallback(
    e => setSearchText(e.target.value),
    [setSearchText]
  )
  const handleOnSearch = useCallback(
    () => {
      console.log('hello world', SearchText);
      console.log('根据searchText查询数据返回的结果', SearchText + 'liuzhicheng')
      alert('alert hello')
    }
  )
  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="logo">
              <Icon type="github" style={githubIconStyle} />
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
              <Avatar size={40} icon="user" />
            </div>
          </div>
        </Container>

      </Header>
      <Content>
        {/* 传入组件 */}
        <Container renderer={<Comp />}>
          { children }
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
            justify-content: "flex-start";
          }
          
        `}
      </style>
      <style jsx global>
        {`
          #__next, .ant-layout {
            height: 100%;
          }
          .ant-layout-header {
            padding-left: 0;
            padding-right: 0;
          }
        `}
      </style>
    </Layout>
  )
}