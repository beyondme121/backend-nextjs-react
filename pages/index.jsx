import getConfig from 'next/config'
import { Button } from 'antd'
import { connect } from 'react-redux'

// 获取action
// import { add } from '../store/store'

const { publicRuntimeConfig } = getConfig()

const Index = () => {
  // console.log("publicRuntimeConfig: ", publicRuntimeConfig.customerKey)
  return <div>
    <Button>hello world</Button>
    <span>zhichengliu</span>
  </div>
}

Index.getInitialProps = async ({ reduxStore}) => {
  // reduxStore.dispatch(add(3))
  return {}
}


const mapStateToProps = (state) => {
  return {
    // count: state.counter.count
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: (num) => dispatch({ type: 'ADD', num})
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index)


