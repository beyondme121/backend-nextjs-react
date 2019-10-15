import dynamic from 'next/dynamic'
// 这个高阶组件用于抽离通用布局, 渲染Detail等需要被渲染的特殊的具体的组件
import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'
// import MDRenderer from '../../components/MarkdownRenderer'
const MDRenderer = dynamic(
  () => import('../../components/MarkdownRenderer'),
  // dynamic动态加载组件未完成时, 传递第二个参数, 配置项, loading配置项, 一个组件 
  {
    loading: () => <p>loading...</p>
  }
)

// 这是一个具体的页面, 比如本页面组件, Detail:明细页面, 也可以是Issues: 问题列表页面, 产品页面...
const Detail = ({ readme }) => {
  return (
    <div>
      <MDRenderer content={readme.content} isBase64={true}/>
    </div>
  )
}
// props是通过 pages/index.js或者search出来的结果,展示Repo组件(/components/Repo),其中每个仓库都是link路由跳转到detail页面
// 所以就Detail页面就是通过router.query来接收props参数, 用于查询
Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res }}) => {
  const readmeResp = await api.request({
    url: `/repos/${owner}/${name}/readme`
  }, req, res)
  return {
    readme: readmeResp.data
  }
}
export default withRepoBasic(Detail, 'index')