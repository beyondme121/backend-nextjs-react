// 这个高阶组件用于抽离通用布局, 渲染Detail等需要被渲染的特殊的具体的组件
import withRepoBasic from '../../components/with-repo-basic'

// 这是一个具体的页面, 比如本页面组件, Detail:明细页面, 也可以是Issues: 问题列表页面, 产品页面...
const Detail = ({ text }) => {
  return <span>Detail index, {text}</span>
}

Detail.getInitialProps = async () => {
  return {
    text: 123
  }
}
export default withRepoBasic(Detail, 'index')