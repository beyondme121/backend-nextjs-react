import App from 'next/app'
import Router from 'next/router'
import Link from 'next/link'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import withRedux from '../lib/withRedux'

// 自定义组件
import Layout from '../components/Layout'
import PageLoading from '../components/pageLoading'

class MyApp extends App {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  startLoading = () => {
    this.setState({
      isLoading: true
    })
  }

  stopLoading = () => {
    this.setState({
      isLoading: false
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.stopLoading)
    Router.events.on('routeChangeError', this.stopLoading)
  }
  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading)
    Router.events.off('routeChangeComplete', this.stopLoading)
    Router.events.off('routeChangeError', this.stopLoading)
  }

  // 全局获取数据, 比如用户数据, 这里的函数与pages中的页面组件有一点不同, 是用个component这个参数的
  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps = {}
    // 必须要做判断,因为并不是每个组件都有这个方法
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return {
      pageProps
    }
  }
  render() {
    // const { customerKey } = process.env
    const { Component, pageProps, reduxStore } = this.props
    return (
      <>
        <Provider store={reduxStore}>
          {
            this.state.isLoading ? <PageLoading /> : null
          }
          <Layout>
            <Link href="/">
              <a>Index</a>
            </Link>
            <Link href='/detail'>
              <a>detail</a>
            </Link>
            <Component pageProps={pageProps} />
          </Layout>
        </Provider>
      </>
    )
  }
}

export default withRedux(MyApp)