import { useState, useCallback, useRef } from 'react'
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'
import api from '../lib/api'

const { Option } = Select;

// 带下拉选择框的输入框, 外部使用组件时也要传递value, 供SearchUser组件的select使用
function SearchUser({ onChange, value }) {
  // { current: 0 }, 调用useRef都会返回这个对象, 只是current的值会变
  const lastFetchIdRef = useRef(0)
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])

  // 用户输入查询, 入参value就是输入框的text文本, 输入事件会将本函数传递给onSearch函数
  const fetchUser = useCallback(debounce(value => {
    console.log('fetching user', value)
    // 请求开始的fetchId
    lastFetchIdRef.current += 1
    // 当前向后端请求的fetchId
    const fetchId = lastFetchIdRef.current

    // 设置搜索的状态为正在搜索, 对notFoundContent的内容有影响
    setFetching(true)
    // 搜索数据之前要清空结果集 options
    setOptions([])

    // 请求github api接口, 此处的api.request不需要传递ctx.req, ctx.res
    // 因为这个操作是用户需要在前端输入查询信息,请求接口数据然后返回数据
    // 这是一个浏览器环境的请求数据, 而不是服务端渲染的数据请求, 我们在api.request已经做了前后端的判断以及封装
    api.request({
      url: `/search/users?q=${value}`
    })
      .then(resp => {
        console.log("user: ", resp.data)
        // 如果当前请求的id !== 初始的请求id,直接return,
        // 场景上次请求数据返回之后又进行了请求数据,那么之前的数据就应该被抛弃
        if (fetchId !== lastFetchIdRef.current) {
          return
        }
        const data = resp.data.items.map(user => ({
          text: user.login,
          value: user.login
        }))
        setFetching(false)
        setOptions(data)
      })
  }, 500), [])

  // 参数value就是Option中的参数value, 用户选择的选项值
  const handleChange = (value) => {
    setOptions([])
    setFetching(false)
    // 把用户选择的值传递出去(传递给调用SearchUser的组件, 比如issues组件查询用户信息)
    // onChange是外部传递的参数, 外部就可以直接使用子组件的数据了
    onChange(value)
  }

  return (
    <Select
      style={{ width: 300 }}
      showSearch={true}   // 是否可以通过输入的方式查询数据, 下拉框是可以输入的
      notFoundContent={fetching ? <Spin size="small" /> : <span>nothing</span>}  // 当结果还没有返回, 显示的内容, 增加一个是否正在搜索的状态数据判断
      filterOption={false}     // 搜索本地的数据选项, 如果是请求服务端的option选项,需要设置为false
      placeholder="创建者"
      onSearch={fetchUser}
      allowClear={true}
      onChange={handleChange} // 用户在下拉框中选择了某个值之后触发的事件回调
      value={value}
    >
      {
        options.map(op => (
          <Option value={op.value} key={op.value}>
            {op.text}
          </Option>
        ))
      }
    </Select>
  )
}

export default SearchUser