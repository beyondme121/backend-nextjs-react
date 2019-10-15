import { useEffect } from 'react'
import Repo from './Repo'
import Link from 'next/link'
import { withRouter } from 'next/router'
import { get, cache } from '../lib/repo-basic-cache'
import api from '../lib/api'


// 入参: 因为从路由拿到的是query对象,key-value对儿
function makeQuery(queryObject) {
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join('='))
      return result
    }, []).join('&')
  return `?${query}`
}

const isServer = typeof window === 'undefined'
/**
 * 这是一个高阶组件HOC: 接收一个组件Comp, return一个组件Detail
 * Comp: 的需要被渲染的组件 (比如不同的不同的内容仓库信息)
 * Detail: 这个组件带有通用的布局代码, 并且把Comp这个定制化的组件内容渲染在Detail组件中
 */

export default function (Comp, type = 'index') {
  // repoBasic, router 这两个参数是这个HOC中, 获取自己要用的参数, 指名道姓的获取到, 其他的参数通过...rest的方式进行收集, 并把rest传递给Comp
  // <Comp {...rest} />
  // rest不是自己这个高阶组件处理的数据, 就直接传递给真正的目标组件即可
  function WithDetail({ repoBasic, router, ...rest }) {
    const query = makeQuery(router.query)

    useEffect(() => {
      if (!isServer) {
        cache(repoBasic)
      }
    })
    
    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic} />
          <div className="tabs">
            {
              type === 'index' ? <span className="tab">ReadMe</span> :
                <Link href={`/detail${query}`}>
                  <a className="tab index">Readme</a>
                </Link>
            }
            {
              type === 'issues' ? <span className="tab">Issues</span> :
                <Link href={`/detail/issues${query}`}>
                  <a className="tab issues">Issues</a>
                </Link>
            }

          </div>
        </div>
        <div>
          {/* 每个页面具体的内容 */}
          <Comp {...rest} />
        </div>
        <style jsx>
          {`
          .root {
            padding-top: 20px;
          }
          .repo-basic {
            padding: 20px;
            border: 1px solid #eee;
            margin-bottom: 20px;
            border-radius: 5px;
          }
          .tab + .tab {
            margin-left: 20px;
          }
        `}
        </style>
      </div>
    )
  }
  // 调用高阶组件的初始化方法,
  WithDetail.getInitialProps = async (context) => {
    const { ctx } = context
    const { owner, name } = ctx.query
    
    // 拼接仓库的full_name, 用于根据full_name获取缓存
    const full_name = `${owner}/${name}`

    // 调用被包裹的组件的getInitialProps, 初始化具体页面的初始化数据请求
    let pageData = {}
    if (Comp.getInitialProps) {
      pageData = await Comp.getInitialProps(context)
      // console.log(pageData)
    }

    // 如果full_name的仓库信息是缓存过的, 就使用缓存数据get(full_name)
    if (get(full_name)) {
      return {
        repoBasic: get(full_name),
        ...pageData
      }
    }

    // 否则没有缓存的话, 就直接请求数据
    // 获取一个仓库的详细信息 github api: GET /repos/:owner/:repo
    const repoBasic = await api.request({
      url: `/repos/${owner}/${name}`
    }, ctx.req, ctx.res)

    // 通过如果之前没有缓存,请求之后的数据也需要进行缓存
    if (!isServer) {
      cache(repoBasic)
    }

    return {
      repoBasic: repoBasic.data,
      ...pageData
    }
  }

  // HOC必须返回一个组件 也就是函数内部声明的组件(函数)
  return withRouter(WithDetail)
}