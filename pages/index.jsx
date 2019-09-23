// import { useEffect } from 'react'
import config from '../config'
import { Button } from 'antd'
import { connect } from 'react-redux'
// import axios from 'axios'
const api = require('../lib/api')


const Index = () => {
  // 模拟post请求, server/api.js 接收post的数据, 向github发送post请求 requestGithub(method, url, data, headers)
  // useEffect(() => {
  //   axios.post('/github/test', { test: 123 })
  // })

  return <div>
    <Button>
      <a href={config.OAUTH_URL}>去登录</a>
    </Button>
  </div>
}

Index.getInitialProps = async ({ ctx }) => {
  // const result = await Axios
  //   .get('/github/search/repositories?q=react')
  //   .then(res => console.log(res))
  // 组件中只需要用request, 因为这个函数已经处理了是客户端还是服务端发起的请求
  const result = await api.request(
    {
      url: '/search/repositories?q=react'
    }, 
    // 只会在服务端渲染的时候才会使用req, 从req中拿到session
    ctx.req, 
    ctx.res
  )

  return {
    data: result.data
  }
}


const mapStateToProps = (state) => {
  return {
    // count: state.counter.count
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: (num) => dispatch({ type: 'ADD', num })
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index)


