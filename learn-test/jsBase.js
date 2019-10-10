let obj = {
  name: 'sanfeng',
  age: 18
}
// 需要把obj组织成 ?name=sanfeng&age=18
// console.log(Object.entries(obj))

// Object.entries() Object.entries: 方法返回一个给定对象自身可枚举属性的键值对数组 [ [ 'name', 'sanfeng' ], [ 'age', 18 ] ]
// let arr = Object.entries(obj).reduce((result, entry) => {
//   result.push(entry.join('='))
//   return result
// }, []).join('&')

// console.log(arr)


function makeQuery (queryObject) {
  const query = Object.entries(queryObject).reduce((result, entry) => {
    result.push(entry.join('='))
    return result // 别忘了result
  }, []).join('&')
  return `?${query}`
}

console.log(makeQuery(obj))