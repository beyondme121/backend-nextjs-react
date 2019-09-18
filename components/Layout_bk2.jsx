import { useState, useCallback } from "react";
import { Layout, Icon, Input, Avatar } from "antd";
const { Header, Content, Footer } = Layout;
import Container from "./Container";

// github图标样式
const githubIconStyle = {
  color: "#fff",
  fontSize: 40,
  paddingTop: 10,
  marginRight: 20
};
// 页脚样式
const footerStyle = {
  textAlign: "center"
};

// const Comp = ({ color, children, style }) => <div style={{ color, ...style }}>{ children }</div>

const Comp = ({ children, color, style }) => (
  <div style={{ color, ...style }}>{children}</div>
);

export default ({ children }) => {
  // 增加组件的状态, 因为涉及到用户的输入,进行查询仓库内容
  const [search, setSearch] = useState("");
  // 受控组件 处理用户输入修改状态数据
  const handleSearchChange = useCallback(
    e => {
      setSearch(e.target.value);
    },
    [setSearch]
  );
  // antd中对Input.Search组件中onSearch的回调函数,用户在输入框中输入完成后, 处理用户点击搜索和回车
  const handleOnSearch = useCallback(() => {
    console.log("回车确认搜索");
  });
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
                placeholder="搜索仓库"
                value={search}
                onChange={handleSearchChange}
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
        <Container>
          {/* 参数: renderer = { <Comp color="red" style={{ fontSize: '40px' }}/> } */}
          {children}
        </Container>
      </Content>
      <Footer style={footerStyle}>
        Develop by Zhicheng Liu @
        <a href="mailto:Zhicheng.liu@cn.abb.com">Zhicheng.liu@cn.abb.com</a>
      </Footer>
      <style jsx>
        {`
          .header-inner {
            display: flex;
            justify-content: space-between;
          }
          .header-left {
            display: flex;
            justify-content: "flex-start";
          }
          .content {
            color: red;
          }
        `}
      </style>
      {/* 全局样式设置 */}
      <style jsx global>
        {`
          #__next, .ant-layout {
            height: 100%;
          }
          
          .ant-layout-header {
            padding-left: 0!important;
            padding-right: 0!important;
          }
        `}
      </style>
    </Layout>
  );
};
