import MarkdownIt from 'markdown-it'

// 这个高阶组件用于抽离通用布局, 渲染Detail等需要被渲染的特殊的具体的组件
import withRepoBasic from '../../components/with-repo-basic'

import api from '../../lib/api'

const md = MarkdownIt()
// 这是一个具体的页面, 比如本页面组件, Detail:明细页面, 也可以是Issues: 问题列表页面, 产品页面...
const Detail = ({ readme }) => {
  // console.log(atob(readme.content))
  const content = atob(readme.content)
  const html = md.render(content)
  return (
    <div dangerouslySetInnerHTML={{ __html: html }}></div>
  )
}

Detail.getInitialProps = async ({ ctx: { query: { owner, name }, req, res }}) => {
  const readmeResp = await api.request({
    url: `/repos/${owner}/${name}/readme`
  }, req, res)
  return {
    readme: readmeResp.data
  }
}
export default withRepoBasic(Detail, 'index')