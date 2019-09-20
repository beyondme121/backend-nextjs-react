function getRedisSessionId (sid) {
  return `ssid:${sid}`
}

/**
 * 敞开3个API,分别表示获取sessionId, 设置session, 销毁session
 */

class RedisSessionStore {
  // 既然要在redis当中操作session, 那么就要接收redis-cli作为参数作为桥梁
  constructor (client) {
    this.client = client
  }

  // 获取Redis中存储的session数据
  async get (sid) {
    // console.log('get session', sid)
    const id = getRedisSessionId(sid)
    const data = await this.client.get(id)
    if (!data) {
      return null
    }
    try {
      const result = JSON.parse(data)
      return result
    } catch (error) {
      console.log(error)
    }
  }

  // 存储session数据到Redis中
  /**
   * 
   * @param {*} sid sessionId
   * @param {*} session  session的内容
   * @param {*} ttl 过期时间
   */
  async set (sid, session, ttl) {
    // console.log('set session', sid)
    const id = getRedisSessionId(sid)
    if (typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000) // 希望给外界的是秒
    }
    try {
      // 这一步转换可能会报错, 所以try
      const sessionStr = JSON.stringify(session)
      if (ttl) {
        await this.client.setex(id, ttl, sessionStr)
      } else {
        await this.client.set(id, sessionStr)
      }
    } catch (err) {
      console.log(err)
    }
  }

  // 销毁session, 从redis当中删除某个session
  async destroy (sid) {
    // console.log('destory session', sid)
    const id = getRedisSessionId(sid)
    await this.client.del(id)
  }
}

module.exports = RedisSessionStore