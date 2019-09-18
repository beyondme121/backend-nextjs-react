import { cloneElement } from 'react'
// 组件定制的样式
const innerStyle = {
  width: '100%',
  maxWidth: 1400,
  margin: '0 auto',
  paddingLeft: 20,
  paddingRight: 20,
}

export default ({ children, renderer = <div /> }) => {

  const newElement = cloneElement(renderer, {
    style: Object.assign({}, innerStyle, renderer.props.style || {}),
    children
  })

  return newElement
}



// const style = {
//   width: '100%',
//   maxWidth: 800,
//   marginLeft: 'auto',
//   marginRight: 'auto'
// }

// export default ({ children }) => {
//   return <div style={style}>
//     { children }
//   </div>
// }




// import React, { cloneElement } from 'react'

// const style = {
//   width: '100%',
//   maxWidth: 800,
//   marginLeft: 'auto',
//   marginRight: 'auto',
//   paddingLeft: 20,
//   paddingRight: 20
// }

// export default ({ children, renderer = <div /> }) => {
//   const newComp = cloneElement(renderer, {
//     style: Object.assign({}, renderer.props.style, style),
//     children
//   })
//   return newComp
// }