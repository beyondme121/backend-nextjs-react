import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import Layout from '../components/Layout'
import withRedux from '../lib/withRedux'
import { Provider } from "react-redux";

class MyApp extends App {
  // 全局获取数据, 比如用户数据, 这里的函数与pages中的页面组件有一点不同, 是用个component这个参数的
  static async getInitialProps(ctx) {
    const { Component } = ctx;
    let pageProps = {};
    // 必须要做判断,因为并不是每个组件都有这个方法
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx); // ctx要传递下去
    }
    return {
      pageProps
    };
  }
  render() {
    // const { customerKey } = process.env
    const { Component, pageProps, reduxStore } = this.props;
    console.log("Component", Component)
    return (
      <Layout>
        <Provider store={reduxStore}>
          <Component {...pageProps} />
        </Provider>
      </Layout>
    )
  }
}

export default withRedux(MyApp)
