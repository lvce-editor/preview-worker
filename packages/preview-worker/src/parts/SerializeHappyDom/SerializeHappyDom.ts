import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as IsDefaultAllowedAttribute from '../IsDefaultAllowedAttribute/IsDefaultAllowedAttribute.ts'

// Tags to skip entirely during serialization
const TAGS_TO_SKIP = new Set(['script', 'meta', 'title'])

// Tags to skip but process children
const TAGS_TO_SKIP_TAG_ONLY = new Set(['html', 'body', 'head'])

// Tags where we extract content as CSS
const CSS_TAGS = new Set(['style'])

export interface SerializeResult {
  readonly css: readonly string[]
  readonly dom: readonly VirtualDomNode[]
}

const serializeNode = (node: any, dom: VirtualDomNode[], css: string[]): number => {
  const { nodeType } = node

  // Text node
  if (nodeType === 3) {
    const textContent = node.textContent || ''
    if (textContent) {
      dom.push(text(textContent))
      return 1
    }
    return 0
  }

  // Not an element node — skip
  if (nodeType !== 1) {
    return 0
  }

  const tagName = (node.tagName || '').toLowerCase()

  // Extract CSS from style elements
  if (CSS_TAGS.has(tagName)) {
    const styleContent = node.textContent || ''
    if (styleContent.trim()) {
      css.push(styleContent)
    }
    return 0
  }

  // Skip certain tags entirely
  if (TAGS_TO_SKIP.has(tagName)) {
    return 0
  }

  // For html/body tags, serialize children only
  if (TAGS_TO_SKIP_TAG_ONLY.has(tagName)) {
    let childCount = 0
    const { childNodes } = node
    for (let i = 0; i < childNodes.length; i++) {
      childCount += serializeNode(childNodes[i], dom, css)
    }
    return childCount
  }

  // Normal element - create a VirtualDomNode
  const newNode: any = {
    childCount: 0,
    type: GetVirtualDomTag.getVirtualDomTag(tagName),
  }

  // Copy allowed attributes
  const { attributes } = node
  if (attributes) {
    for (let i = 0; i < attributes.length; i++) {
      const attr = attributes[i]
      const attrName = attr.name
      if (IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attrName, [])) {
        let finalName = attrName
        if (attrName === 'class') {
          finalName = 'className'
        } else if (attrName === 'type') {
          finalName = 'inputType'
        }
        newNode[finalName] = attr.value
      }
    }
  }

  // Reserve position in dom array for this node
  dom.push(newNode)

  // Serialize children
  let childCount = 0
  const { childNodes } = node
  for (let i = 0; i < childNodes.length; i++) {
    childCount += serializeNode(childNodes[i], dom, css)
  }
  newNode.childCount = childCount

  return 1
}

export const serialize = (document: any): SerializeResult => {
  const dom: VirtualDomNode[] = []
  const css: string[] = []

  // Start from document.documentElement (the <html> element)
  const root = document.documentElement || document.body
  if (!root) {
    return { css, dom }
  }

  let rootChildCount = 0
  const { childNodes } = root
  for (let i = 0; i < childNodes.length; i++) {
    rootChildCount += serializeNode(childNodes[i], dom, css)
  }

  try {
    Object.defineProperty(dom, 'rootChildCount', {
      configurable: true,
      enumerable: false,
      value: rootChildCount,
    })
  } catch {
    ;(dom as any).rootChildCount = rootChildCount
  }

  return { css, dom }
}
