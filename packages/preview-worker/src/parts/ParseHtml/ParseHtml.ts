import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import * as Assert from '../Assert/Assert.ts'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.ts'
import * as IsSelfClosingTag from '../IsSelfClosingTag/IsSelfClosingTag.ts'
import * as ParseText from '../ParseText/ParseText.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'

export const parseHtml = (html: string, allowedAttributes: readonly string[]): readonly VirtualDomNode[] => {
  Assert.string(html)
  Assert.array(allowedAttributes)
  const tokens = TokenizeHtml.tokenizeHtml(html)
  const dom: VirtualDomNode[] = []
  const root: VirtualDomNode = {
    childCount: 0,
    type: 0,
  }
  let current: any = root
  const stack: VirtualDomNode[] = [root]
  let attributeName = ''
  for (const token of tokens) {
    switch (token.type) {
      case HtmlTokenType.AttributeName:
        attributeName = token.text
        break
      case HtmlTokenType.AttributeValue:
        if (allowedAttributes.includes(attributeName)) {
          const finalAttributeName = attributeName === 'class' ? 'className' : attributeName
          current[finalAttributeName] = token.text
        }
        attributeName = ''
        break
      case HtmlTokenType.ClosingAngleBracket:
      case HtmlTokenType.WhitespaceInsideOpeningTag:
        // Handle boolean attributes (attributes without values)
        if (attributeName && allowedAttributes.includes(attributeName)) {
          const finalAttributeName = attributeName === 'class' ? 'className' : attributeName
          current[finalAttributeName] = attributeName
        }
        attributeName = ''
        break
      case HtmlTokenType.Content:
        current.childCount++
        dom.push(text(ParseText.parseText(token.text)))
        break
      case HtmlTokenType.TagNameEnd:
        if (stack.length > 1) {
          stack.pop()
        }
        current = stack.at(-1) || root
        break
      case HtmlTokenType.TagNameStart:
        current.childCount++
        const newNode: VirtualDomNode = {
          childCount: 0,
          type: GetVirtualDomTag.getVirtualDomTag(token.text),
        }
        dom.push(newNode)
        current = newNode
        if (!IsSelfClosingTag.isSelfClosingTag(token.text)) {
          stack.push(current)
        }
        break
      default:
        break
    }
  }
  try {
    Object.defineProperty(dom, 'rootChildCount', {
      configurable: true,
      enumerable: false,
      value: root.childCount,
    })
  } catch {
    ;(dom as any).rootChildCount = root.childCount
  }

  return dom
}
