import * as Assert from '../Assert/Assert.ts'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.ts'
import * as IsSelfClosingTag from '../IsSelfClosingTag/IsSelfClosingTag.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'

export const getParsedNodesChildNodeCount = (html: string): number => {
  Assert.string(html)
  const tokens = TokenizeHtml.tokenizeHtml(html)
  let rootChildCount = 0
  let depth = 0

  for (const token of tokens) {
    switch (token.type) {
      case HtmlTokenType.Content:
        if (depth === 0) {
          rootChildCount++
        }
        break
      case HtmlTokenType.TagNameEnd:
        depth--
        break
      case HtmlTokenType.TagNameStart:
        if (depth === 0) {
          rootChildCount++
        }
        if (!IsSelfClosingTag.isSelfClosingTag(token.text)) {
          depth++
        }
        break
      default:
        break
    }
  }

  return rootChildCount
}
