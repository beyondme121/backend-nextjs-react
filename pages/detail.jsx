const Detail = () => {
  return (
    <div>
      detail
    </div>
  )
}
// 模拟后端渲染请求数据, 延迟响应数据, 使得pageLoading组件可以停留1.5秒
Detail.getInitialProps = async () => {
  await new Promise(resolve => {
    setTimeout(() => {
      resolve({})
    }, 1500)
  })
}

// Detail.getInitialProps = () => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve({})
//     }, 1000)
//   })
// }

export default Detail