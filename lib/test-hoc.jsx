// 1. 版本一: 最基本的HOC
// export default (Comp) => {
//   // 返回的函数组件要代替传入的Comp组件使用的, 就是对传入的Comp进行功能的增强
//   // 当最终使用的这个组件的时候, 接收的参数完完全全的把参数再传递给基础(原始)组件Comp
//   return function TestHOCComp (props) {
//     return <Comp {...props} />
//   }
// }



// 2. 对原始组件进行处理
export default Comp => {
  return function HocComp({ name, age, ...rest }) {
    // 包裹的组件还可以接收name age属性, 并且可以对props进行处理
    const name = name +'123'
    return (
      <Comp 
        {...rest}
        name={name} 
        age={age}
      />
    )
  }
}