import { Avatar } from 'antd'
import withRepoBasic from '../../components/with-repo-basic'
import api from '../../lib/api'

const IssueItem = ({ issue }) => {
  return (
    <div className="issue">
      <div className="avatar">
        <Avatar src={issue.user.avatar_url} shape="square" />
      </div>
    </div>
  )
}
const Issues = ({ issues }) => {
  
  return (
    <div className="root">
      <div className="issues">
        {
          issues.map(item => <IssueItem issue={item} key={item.id} />)
        }
      </div>
    </div>
  )
}

Issues.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query

  const issuesResp = await api.request({
    url: `/repos/${owner}/${name}/issues`
  }, ctx.req, ctx.res)

  return {
    issues: issuesResp.data
  }
}

export default withRepoBasic(Issues, 'issues')