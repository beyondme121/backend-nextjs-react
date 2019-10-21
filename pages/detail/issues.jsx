import { useState, useCallback, useEffect } from "react";
import { Avatar, Button, Select, Spin } from "antd";
import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";
import dynamic from "next/dynamic";
import { getLastUpdated } from "../../lib/utils";
import SearchUser from '../../components/SearchUser'

const { Option } = Select

const MDRenderer = dynamic(() => import('../../components/MarkdownRenderer'))

// 服务端渲染不进行缓存
const isServer = typeof window === 'undefined'
const CACHE = {}

// 点击查看显示详情
function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MDRenderer content={issue.body} />
      <div className="actions">
        <Button type="primary" href={issue.href_url} target="_blank">
          打开issue详情
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fefefe;
          padding: 20px;
        }
        .actions {
          text-align: right;
        }
        `}</style>
    </div>
  )
}

// label组件
function Label({ label }) {
  return (
    <>
      <span className="label" style={{ background: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 10px;
          padding: 3px 10px;
          border-radius: 3px;
          font-size: 14px;
        }
        `}</style>
    </>
  )
}

const IssueItem = ({ issue }) => {
  const [showDetail, setShowDetail] = useState(false);

  // const toggleShowDetail = () => {
  //   setShowDetail(!showDetail)
  // }
  // const toggleShowDetail = useCallback(() => {
  //   setShowDetail(!showDetail)
  // }, [showDetail])

  // 1. 优化1 使用useCallback
  // 2. 给setShowDetail传递回调函数, useCallback就不依赖showDetail内部的变量, 逃过了闭包
  const toggleShowDetail = useCallback(() => {
    setShowDetail(detail => !detail);
  }, []);

  return (
    <div>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: "absolute", right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "隐藏" : "查看"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" />
        </div>
        <div className="main-info">
          <h6>
            <span>{issue.title}</span>
            {
              issue.labels.map(label => <Label label={label} key={label.id} />)
            }
          </h6>
          <div className="sub-info">
            <span>Updated at {getLastUpdated(issue.updated_at)}</span>
          </div>
        </div>
      </div>
      {showDetail ? <IssueDetail issue={issue} /> : null}
      <style jsx>{`
        .issue {
          display: flex;
          position: relative;
        }
        .issue:hover {
          background-color: #fafafa;
        }
        .issue + .issue {
          border-top: 1px solid #eee;
        }
        .main-info > h6 {
          max-width: 600px;
          font-size: 16px;
          padding-right: 60px;
        }
        .avatar {
          margin-right: 20px;
        }
        .sub-info {
          margin-bottom: 10px;
        }
        .sub-info > span + span {
          display: inline-block;
          margin-left: 20px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};

// 拼接query的方法, 用于获取用户查询,状态选择,标签选择 结果的query拼接 返回值再加上 查询issues的url就是整个的查询issues的url
const makeQuery = (creator, state, labels) => {
  let creatorStr = creator ? `creator=${creator}` : ''
  let stateStr = state ? `state=${state}` : ''
  let labelStr = ''
  if (labels && labels.length > 0) {
    labelStr = `labels=${labels.join(',')}`
  }
  const arr = []
  if (creatorStr) arr.push(creatorStr)
  if (stateStr) arr.push(stateStr)
  if (labelStr) arr.push(labelStr)
  return `?${arr.join('&')}`
}

const Issues = ({ initialIssues, labels, owner, name }) => {
  // issues数据,将initialIssues作为issues初始化的数据
  const [issues, setIssues] = useState(initialIssues) // 当点击搜索时才会调用setIssues

  const [creator, setCreator] = useState()
  const handleCreatorChange = useCallback((value) => {
    setCreator(value)
  }, [])

  // repos的状态
  const [state, setState] = useState()
  const handleStateChange = useCallback((value) => {
    setState(value)
  }, [])

  // 选中的label的状态数据以及handle方法
  const [label, setLabel] = useState([])
  const handleLabelChange = useCallback(value => {
    setLabel(value)
  }, [])

  // 组件fetching的状态
  const [fetching, setFetching] = useState(false)

  // 点击 "搜索" 出发的cb
  const handleSearch = useCallback(() => {
    // 设置动画的状态
    setFetching(true)
    // 与初始化的issues的api写法类似,只是这个请求是从前端发起的, 不是服务端渲染
    api.request({
      url: `/repos/${owner}/${name}/issues${makeQuery(creator, state, label)}`
    })
      .then(resp => {
        setIssues(resp.data)
        setFetching(false)
      })
      .catch(err => {
        console.error(err)
      })
  }, [owner, name, creator, state, label])

  // 缓存label数据, 从props中获取labels并缓存数据到CACHE中,key就是owner/name
  // 当owner,name,labels发生变化的时候才重新执行函数
  useEffect(() => {
    if (!isServer) {
      CACHE[`${owner}/${name}`] = labels
    }
  }, [owner, name, labels])

  return (
    <div className="root">
      <div className="search">
        {/* 用户搜索 */}
        <SearchUser onChange={handleCreatorChange} value={creator} />
        {/* 状态下拉框选择 */}
        <Select onChange={handleStateChange} value={state} placeholder="状态" style={{ width: 200, marginLeft: 20 }}>
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>
        {/* labels */}
        <Select
          mode="multiple"
          onChange={handleLabelChange}
          value={label}
          placeholder="标签"
          // style={{ width: 200, marginLeft: 20 }}
          style={{ flexGrow: 1, marginLeft: 20, marginRight: 20 }}
        >
          {
            labels.map(item => (
              <Option value={item.name} key={item.id}>
                {item.name}
              </Option>
            ))
          }
        </Select>
        {/* 当点击搜索还没有返回结果前, Button按钮处于disable */}
        <Button type="primary" disabled={fetching} onClick={handleSearch}>搜索</Button>
      </div>
      <div className="issues">
        {
          fetching ?
            <div className="loading"><Spin /></div> :
            <div>
              {issues.map(item => (
                <IssueItem issue={item} key={item.id} />
              ))}
            </div>
        }
      </div>
      <style jsx>
        {`
          .issues {
            border: 1px solid #eee;
            border-radius: 5px;
            margin-bottom: 20px;
            margin-top: 20px;
          }
          .search {
            display: flex;
          }
          .loading {
            height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
};

Issues.getInitialProps = async ({ ctx }) => {
  const { owner, name } = ctx.query;
  const full_name = `${owner}/${name}`

  const fetchs = await Promise.all([
    await api.request({
      url: `/repos/${owner}/${name}/issues`
    }, ctx.req, ctx.res),
    CACHE[full_name] ? { data: CACHE[full_name] } :
      await api.request({
        url: `/repos/${owner}/${name}/labels`
      }, ctx.req, ctx.res)
  ])


  return {
    // owner,name在Issue中通过handleSearch是拿不到owner和name的, 只能通过第一次服务端渲染,即通过点击跳转通过props传递进来的方式
    // const { owner, name } = ctx.query
    owner,
    name,
    initialIssues: fetchs[0].data,   // 第一次请求数据没有搜索条件的
    labels: fetchs[1].data
  };
};

export default withRepoBasic(Issues, "issues");
