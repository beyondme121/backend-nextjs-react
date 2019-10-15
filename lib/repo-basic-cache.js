import LRU from 'lru-cache'
// 缓存仓库的基本信息,一般缓存不经常变更的信息
const REPO_CACHE = new LRU({
  maxAge: 1000 * 60 * 60  // 1小时
})

// 设置缓存, 以仓库的full_name为key, 仓库信息对象为value
export function cache (repo) {
  const full_name = repo.full_name
  REPO_CACHE.set(full_name, repo)
}

// 获取仓库信息 full_name: owner/name -> facebook/react
export function get (full_name) {
  return REPO_CACHE.get(full_name)
}

// 处理列表
export function cacheArray (repos) {
  // debugger
  if (repos && Array.isArray(repos)) {
    repos.forEach(repo => cache(repo))
  }
}