import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import * as Assert from '../Assert/Assert.ts'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.ts'
import * as IsDefaultAllowedAttribute from '../IsDefaultAllowedAttribute/IsDefaultAllowedAttribute.ts'
import * as IsSelfClosingTag from '../IsSelfClosingTag/IsSelfClosingTag.ts'
import * as ParseText from '../ParseText/ParseText.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'

export const parseHtml = (html: string, allowedAttributes: readonly string[] = [], defaultAllowedAttributes: readonly string[] = []): readonly VirtualDomNode[] => {
  Assert.string(html)
  Assert.array(allowedAttributes)
  Assert.array(defaultAllowedAttributes)
  
  // Combine default allowed attributes with any additional ones provided
  const allAllowedAttributes = new Set([...defaultAllowedAttributes, ...allowedAttributes])
  const tokens = TokenizeHtml.tokenizeHtml(html)
  const dom: VirtualDomNode[] = []
  const root: VirtualDomNode = {
    childCount: 0,
    type: 0,
  }
  let current: any = root
  const stack: VirtualDomNode[] = [root]
  let attributeName = ''
  let lastTagWasSelfClosing = false
  for (const token of tokens) {
    switch (token.type) {
      case HtmlTokenType.AttributeName:
        attributeName = token.text
        break
      case HtmlTokenType.AttributeValue:
        if (allAllowedAttributes.has(attributeName) || IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attributeName, defaultAllowedAttributes)) {
          const finalAttributeName = attributeName === 'class' ? 'className' : attributeName
          current[finalAttributeName] = token.text
        }
        attributeName = ''
        break
      case HtmlTokenType.ClosingAngleBracket:
        // Handle boolean attributes (attributes without values)
        if (attributeName && (allAllowedAttributes.has(attributeName) || IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attributeName, defaultAllowedAttributes))) {
          const finalAttributeName = attributeName === 'class' ? 'className' : attributeName
          current[finalAttributeName] = attributeName
        }
        attributeName = ''
        // Return to parent if the current tag is self-closing
        if (lastTagWasSelfClosing) {
          current = stack.at(-1) || root
          lastTagWasSelfClosing = false
        }
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
        lastTagWasSelfClosing = IsSelfClosingTag.isSelfClosingTag(token.text)
        if (!lastTagWasSelfClosing) {
          stack.push(current)
        }
        break
      case HtmlTokenType.WhitespaceInsideOpeningTag:
        // Handle boolean attributes (attributes without values)
        if (attributeName && (allAllowedAttributes.has(attributeName) || IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attributeName, defaultAllowedAttributes))) {
          const finalAttributeName = attributeName === 'class' ? 'className' : attributeName
          current[finalAttributeName] = attributeName
        }
        attributeName = ''
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
