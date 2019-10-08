import { withRouter } from 'next/router'
import Link from 'next/link'
import Router from 'next/router'
import { Row, Col, List } from 'antd'
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

const selectedItemStyle = {
  borderLeft: '2px solid #e36209',
  fontWeight: 100
}

const Search = ({ router, repos }) => {
  // 没有在组件内创建state, 而是通过参数的形式, 是因为页面的显示的数据是根据url来定义的
  // 不需要组件自己维护状态
  const { lang, sort, order, query } = router.query
  // 路由的方法跳转,拼接路由url, 在点击a标签之后
  const handleLanguageChange = language => {
    Router.push({
      pathname: '/search',
      query: {
        query,
        lang: language,
        sort,
        order
      }
    })
  }
  const handleSortChange = sort => {
    Router.push({
      pathname: '/search',
      query: {
        query,
        lang,
        sort: sort.value,
        order: sort.order
      }
    })
  }

  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List 
            bordered
            header={<span className="list-header">语言</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGE}
            renderItem = { item => {
              const selected = item === lang
              return  (<List.Item style={selected ? selectedItemStyle : null}>
                        <a onClick={ () => handleLanguageChange(item) }>{item}</a>
                        </List.Item>  
                      )
            }}
          />
          <List 
            bordered
            header={<span className="list-header">排序</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem = { item => {
              let selected = false
              if (item.name === 'Best Match' && !sort) {
                selected = true
              } else if (item.value === sort && item.order === order) {
                selected = true
              }
              return (
                <List.Item style={ selected ? selectedItemStyle : null }>
                  <a onClick={ () => handleSortChange(item) }>{item.name}</a>
                </List.Item>
              )
            }}
          />
        </Col>
      </Row>
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

  const result = await api.request({
    url: `/search/repositories${querystring}`
  }, ctx.req, ctx.res)
  console.log(result)
  return {
    repos: result.data
  }
}

export default withRouter(Search);