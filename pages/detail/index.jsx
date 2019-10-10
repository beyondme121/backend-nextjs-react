import { withRouter } from 'next/router'
import Repo from '../../components/Repo'
import Link from 'next/link'
import api from '../../lib/api'

// 入参: 因为从路由拿到的是query对象,key-value对儿
function makeQuery (queryObject) {
  const query = Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join('='))
      return result
    }, []).join('&')
  return `?${query}`
}

function Detail ({ repoBasic, router}) {

  const query = makeQuery(router.query)

  return (
    <div className="root">
      <div className="repo-basic">
        <Repo repo={ repoBasic }/>
        <div className="tabs">
          <Link href={`/detail${query}`}>
            <a className="tab index">Readme</a>
          </Link>
          <Link href={`/detail/issues${query}`}>
            <a className="tab issues">Issues</a>
          </Link>
        </div>
      </div>
      <div>Readme</div>
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

Detail.getInitialProps = async ({ ctx }) => {
  // console.log(ctx.query)
  // const { owner, name } = router.query
  const { owner, name } = ctx.query
  // 获取一个仓库的详细信息 github api: GET /repos/:owner/:repo
  const repoBasic = await api.request({
    url: `/repos/${owner}/${name}`
  }, ctx.req, ctx.res)

  return {
    repoBasic: repoBasic.data
  }
}

export default withRouter(Detail)