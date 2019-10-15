import { memo, useMemo } from 'react'
// 因为是一个每次都要渲染的组件, 使用useMemo
import MarkdownIt from 'markdown-it'
import 'github-markdown-css'

const md = new MarkdownIt({
  html: true,
  linkify: true
})

function b64_to_utf8 (str) {
  return decodeURIComponent(escape(atob(str)))
}
// 每次都要渲染的组件, 而且组件的渲染只与props有关, 如果props没有发生变化组件就没有必要重新渲染

export default memo(function MarkdownRenderer ({ content, isBase64 }) {
  const markdown = isBase64 ? b64_to_utf8(content) : content
  // md.render渲染挺耗时的,如果markdown没有发生变化,我们就缓存渲染之后的结果html
  const html = useMemo(() => md.render(markdown), [markdown])

  return (
    <div className="markdown-body">
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
})
