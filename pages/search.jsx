import { withRouter } from 'next/router'
import Link from 'next/link'
import Router from 'next/router'
import { Row, Col, List, Pagination } from 'antd'
import { memo, isValidElement } from 'react'
// 所有结果展示, 复用Repo组件
import Repo from '../components/Repo'

const api = require('../lib/api')
/**
 * 搜索条件
 */
const LANGUAGE = ['javascript', 'HTML', 'CSS', 'Typescript']
const SORT_TYPES = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc'
  }
]
const per_page = 10
const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 100
}

const doSearch = config => {
  Router.push({
    pathname: '/search',
    query: config
  })
}
const noop = () => {}

// 定义查询链接跳转组件
const FilterLink = memo(({ name, query, lang, sort, order, page }) => {

  let querystring = `?query=${query}`
  if (lang) querystring += `&lang=${lang}`
  if (sort) querystring += `&sort=${sort}&order=${order || 'desc'}`
  if (page) querystring += `&page=${page}`
  querystring += `&per_page=${per_page}`
  // console.log(isValidElement(name))
  return (
    <Link href={`/search${querystring}`}>
      { isValidElement(name) ? name : <a>{name}</a> }
      {/* <a>{name}</a> */}
    </Link>
  )
})

const Search = ({ router, repos }) => {
  // 没有在组件内创建state, 而是通过参数的形式, 是因为页面的显示的数据是根据url来定义的
  // 不需要组件自己维护状态
  // const { lang, sort, order, query } = router.query
  const { ...querys } = router.query
  const { lang, sort, order, page } = router.query
  // 路由的方法跳转,拼接路由url, 在点击a标签之后
  // const handleLanguageChange = language => {
  //   Router.push({
  //     pathname: '/search',
  //     query: {
  //       query,
  //       lang: language,
  //       sort,
  //       order
  //     }
  //   })
  // }
  // const handleSortChange = sort => {
  //   Router.push({
  //     pathname: '/search',
  //     query: {
  //       query,
  //       lang,
  //       sort: sort.value,
  //       order: sort.order
  //     }
  //   })
  // }

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGE}
            renderItem={item => {
              const selected = item === lang
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? <span>{item}</span> : 
                    <FilterLink
                      {...querys}
                      name={item}
                      lang={item}
                    />}
                </List.Item>
              )
            }}
          />
          <List
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={item => {
              let selected = false
              if (item.name === 'Best Match' && !sort) {
                selected = true
              } else if (item.value === sort && item.order === order) {
                selected = true
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {
                    selected ? <span>{item.name}</span> :
                    <FilterLink {...querys} name={item.name} sort={item.value} order={item.order} />
                  }
                </List.Item>
              )
            }}
          />
        </Col>

        {/* 查询结果展示 */}
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count}个仓库</h3>
          {
            repos.items.map(repo => <Repo repo = { repo } key = {repo.id} />)
          }
          <div className="pagination">
            <Pagination 
              pageSize={30}
              current={ Number(page) || 1}
              total={repos.total_count}
              onChange={noop}
              itemRender={(page, type, ol) => {
                // console.log(page) pagination中的参数page是个标签,需要进行判断
                const p = type === 'page' ? page : type === 'prev' ? page - 1 : page + 1
                const name = type === 'page' ? page : ol
                return <FilterLink {...querys} page = {p} name = {name}/>
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>
         {`
            .root {
              padding: 20px 0;
            }
            .list-header {
              font-weight: 800;
              font-size: 16px;
            }
            .repos-title {
              border-bottom: 1px solid #eee;
              font-size: 20px;
              line-height: 50px;
            }
            .pagination {
              padding: 20px;
              text-align: center;
            }
         `}   
      </style>
    </div>
  )
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query
  if (!query) {
    return {
      repos: {
        total_count: 0
      }
    }
  }
  // ?q=react+language:javascript&sort=stars&order=desc&page=2
  let querystring = `?q=${query}`
  if (lang) querystring += `+language:${lang}`
  if (sort) querystring += `&sort=${sort}&order=${order || 'desc'}`
  if (page) querystring += `&page=${page}`
  querystring += `&per_page=${per_page}`
  const result = await api.request({
    url: `/search/repositories${querystring}`
  }, ctx.req, ctx.res)
  console.log(result)
  return {
    repos: result.data
  }
}

export default withRouter(Search);