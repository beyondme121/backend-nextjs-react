//////////////////////////////// 第三个版本  ////////////////////////////////
/**
 * 测试服务端渲染的时候, 是否可以去触发action去修改state, 并且state可以同步到客户端
 */
import React from 'react'
import createStore from '../store/store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState)
  }
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = createStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}


export default Comp => {

  class WithRedux extends React.Component {
    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      const { Component, pageProps, ...rest } = this.props;
      if (pageProps) {
        pageProps.test = '123'
      }
      return <Comp Component={Component} pageProps={pageProps} {...rest} reduxStore={this.reduxStore} />
    }
  }

  // v3中修改的内容: 先创建store, 然后把reduxStore赋值给ctx, 然后所有组件的服务端渲染初始化的时候都传递ctx这个参数(Comp.getInitialProps(ctx)),
  // 所以每个组件都具有了store, 每个组件就可以触发action
  WithRedux.getInitialProps = async (ctx) => {

    let reduxStore
    if (isServer) {
      // 解构的req可能是不存在的,只有在服务端渲染的时候才会存在, 前端切换路由也会执行getInitialProps
      const { req } = ctx.ctx
      const session = req.session
      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo
        })
      } else {
        reduxStore = getOrCreateStore()
      }
    } else {
      reduxStore = getOrCreateStore()
    }


    ctx.reduxStore = reduxStore
    let appProps = {}
    if (typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }
    return {
      ...appProps,
      initialReduxState: reduxStore.getState()
    }
  }
  return WithRedux
}





//////////////////////////////// 第二个版本 修改为类组件, 构造函数中初始化reduxStore ////////////////////////////////
// import React from 'react'
// import createStore from '../store/store'

// const isServer = typeof window === 'undefined'
// const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

// function getOrCreateStore (initialState) {
//   if (isServer) {
//     return createStore(initialState)
//   }
//   if (!window[__NEXT_REDUX_STORE__]) {
//     window[__NEXT_REDUX_STORE__] = createStore(initialState)
//   }
//   return window[__NEXT_REDUX_STORE__]
// }


// export default Comp => {

//   class WithRedux extends React.Component {
//     constructor (props) {
//       super(props)
//       this.reduxStore = getOrCreateStore(props.initialReduxState)
//     }

//     render () {
//       const {Component, pageProps, ...rest} = this.props;
//       console.log(Component, pageProps)
//       if (pageProps) {
//         pageProps.test = '123'
//       }
//       return <Comp Component={Component} pageProps={pageProps} {...rest} reduxStore = {this.reduxStore}/>
//     }
//   }


//   WithRedux.getInitialProps = async (ctx) => {
//     let appProps = {}
//     if (typeof Comp.getInitialProps === 'function') {
//       appProps = await Comp.getInitialProps(ctx)
//     }
//     const reduxStore = getOrCreateStore()
//     return {
//       ...appProps,
//       initialReduxState: reduxStore.getState()
//     }
//   }
//   return WithRedux
// }





//////////////////////////////// 第一个版本 nextjs集成redux: 使用高阶组件将reduxStore注入到next  ////////////////////////////////

// import createStore from '../store/store'

// const isServer = typeof window === 'undefined'
// const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

// function getOrCreateStore (initialState) {
//   if (isServer) {
//     return createStore(initialState)
//   }
//   if (!window[__NEXT_REDUX_STORE__]) {
//     window[__NEXT_REDUX_STORE__] = createStore(initialState)
//   }
//   return window[__NEXT_REDUX_STORE__]
// }


// export default Comp => {
//   function TestHocComp ({Component, pageProps, ...rest}) {
//     console.log(Component, pageProps)
//     if (pageProps) {
//       pageProps.test = '123'
//     }
//     return <Comp Component={Component} pageProps={pageProps} {...rest}/>
//   }
//   TestHocComp.getInitialProps = async (ctx) => {
//     let appProps = {}
//     if (typeof Comp.getInitialProps === 'function') {
//       appProps = await Comp.getInitialProps(ctx)
//     }
//     const reduxStore = getOrCreateStore()
//     return {
//       ...appProps,
//       initialReduxState: reduxStore.getState()
//     }
//   }
//   return TestHocComp
// }