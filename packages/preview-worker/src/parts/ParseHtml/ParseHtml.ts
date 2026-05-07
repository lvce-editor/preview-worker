/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { text } from '@lvce-editor/virtual-dom-worker'
import type { ParseResult } from '../ParseResult/ParseResult.ts'
import type { ScriptTag } from '../ScriptTag/ScriptTag.ts'
import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'
import * as Assert from '../Assert/Assert.ts'
import * as GetVirtualDomTag from '../GetVirtualDomTag/GetVirtualDomTag.ts'
import * as HtmlTokenType from '../HtmlTokenType/HtmlTokenType.ts'
import * as IsDefaultAllowedAttribute from '../IsDefaultAllowedAttribute/IsDefaultAllowedAttribute.ts'
import * as IsSelfClosingTag from '../IsSelfClosingTag/IsSelfClosingTag.ts'
import * as NormalizeAttributeName from '../NormalizeAttributeName/NormalizeAttributeName.ts'
import * as ParseText from '../ParseText/ParseText.ts'
import * as TokenizeHtml from '../TokenizeHtml/TokenizeHtml.ts'

// Tags that should be completely skipped (both tag and content)
const TAGS_TO_SKIP_COMPLETELY = new Set(['meta', 'title'])

// Tags that should have their opening/closing tags skipped but content processed
const TAGS_TO_SKIP_TAG_ONLY = new Set(['html', 'head'])

// Tags where we capture content as CSS
const TAGS_TO_CAPTURE_AS_CSS = new Set(['style'])

// Tags where we capture content as JavaScript
const TAGS_TO_CAPTURE_AS_JS = new Set(['script'])

// Attribute name normalization is implemented in a separate module

type MutableVirtualDomNode = VirtualDomNode & Record<string, any>

type ParserContext = {
  allAllowedAttributes: Set<string>
  attributeName: string
  captureCss: boolean
  captureJs: boolean
  captureScriptAttributes: boolean
  captureStylesheetLink: boolean
  css: string[]
  cssContent: string
  current: MutableVirtualDomNode
  defaultAllowedAttributes: readonly string[]
  dom: VirtualDomNode[]
  jsContent: string
  lastTagWasSelfClosing: boolean
  root: MutableVirtualDomNode
  scriptSrc: string
  scriptTags: ScriptTag[]
  scripts: string[]
  skipDepth: number
  stack: MutableVirtualDomNode[]
  styleSheets: StyleSheet[]
  stylesheetHref: string
  stylesheetRel: string
  stylesheets: string[]
  tagStack: string[]
  useBuiltInDefaults: boolean
}

const setStylesheetAttribute = (context: ParserContext, name: string, value: string): void => {
  if (name === 'href') {
    context.stylesheetHref = value
  } else if (name === 'rel') {
    context.stylesheetRel = value
  }
}

const finalizeStylesheetLink = (context: ParserContext): void => {
  if (context.stylesheetRel.toLowerCase() === 'stylesheet' && context.stylesheetHref) {
    context.stylesheets.push(context.stylesheetHref)
    context.styleSheets.push({
      href: context.stylesheetHref,
      type: 'link',
    })
  }
  context.captureStylesheetLink = false
  context.stylesheetHref = ''
  context.stylesheetRel = ''
}

const setScriptAttribute = (context: ParserContext, name: string, value: string): void => {
  if (name === 'src') {
    context.scriptSrc = value
  }
}

const isAllowedAttribute = (context: ParserContext, attributeName: string): boolean => {
  return (
    context.allAllowedAttributes.has(attributeName) ||
    (context.useBuiltInDefaults && IsDefaultAllowedAttribute.isDefaultAllowedAttribute(attributeName, context.defaultAllowedAttributes))
  )
}

const assignAllowedAttribute = (context: ParserContext, value: string): void => {
  if (!isAllowedAttribute(context, context.attributeName)) {
    context.attributeName = ''
    return
  }
  const finalAttributeName = NormalizeAttributeName.normalizeAttributeName(context.attributeName)
  context.current[finalAttributeName] = value
  context.attributeName = ''
}

const flushBooleanAttribute = (context: ParserContext): void => {
  if (!context.attributeName) {
    return
  }
  assignAllowedAttribute(context, context.attributeName)
}

const isCapturingTagContent = (context: ParserContext): boolean => {
  return context.captureCss || context.captureJs
}

const canCaptureDomAttributes = (context: ParserContext): boolean => {
  return context.skipDepth === 0 && !isCapturingTagContent(context)
}

const closeCurrentNode = (context: ParserContext): void => {
  if (context.stack.length > 1) {
    context.stack.pop()
  }
  context.current = context.stack.at(-1) || context.root
}

const resetCurrentNode = (context: ParserContext): void => {
  context.current = context.stack.at(-1) || context.root
}

const finalizeCapturedCss = (context: ParserContext): void => {
  if (context.cssContent.trim()) {
    context.css.push(context.cssContent)
    context.styleSheets.push({
      content: context.cssContent,
      type: 'style',
    })
  }
  context.cssContent = ''
  context.captureCss = false
}

const finalizeCapturedScript = (context: ParserContext): void => {
  if (context.scriptSrc.trim()) {
    context.scriptTags.push({
      src: context.scriptSrc,
      type: 'external',
    })
  } else if (context.jsContent.trim()) {
    context.scripts.push(context.jsContent)
    context.scriptTags.push({
      content: context.jsContent,
      type: 'inline',
    })
  }
  context.jsContent = ''
  context.scriptSrc = ''
  context.captureJs = false
  context.captureScriptAttributes = false
}

const handleAttributeNameToken = (context: ParserContext, tokenText: string): void => {
  if (context.captureScriptAttributes || canCaptureDomAttributes(context)) {
    context.attributeName = tokenText
  }
}

const handleAttributeValueToken = (context: ParserContext, tokenText: string): void => {
  if (context.captureStylesheetLink) {
    setStylesheetAttribute(context, context.attributeName, tokenText)
    context.attributeName = ''
    return
  }
  if (context.captureScriptAttributes) {
    setScriptAttribute(context, context.attributeName, tokenText)
    context.attributeName = ''
    return
  }
  if (canCaptureDomAttributes(context)) {
    assignAllowedAttribute(context, tokenText)
  } else {
    context.attributeName = ''
  }
}

const handleClosingAngleBracketToken = (context: ParserContext): void => {
  if (context.captureScriptAttributes && context.attributeName) {
    setScriptAttribute(context, context.attributeName, context.attributeName)
  }
  if (context.captureScriptAttributes) {
    context.captureScriptAttributes = false
    context.attributeName = ''
  }
  if (context.captureStylesheetLink && context.lastTagWasSelfClosing) {
    finalizeStylesheetLink(context)
  }
  if (context.captureStylesheetLink || !canCaptureDomAttributes(context)) {
    return
  }
  flushBooleanAttribute(context)
  if (context.lastTagWasSelfClosing) {
    resetCurrentNode(context)
    context.lastTagWasSelfClosing = false
  }
}

const handleContentToken = (context: ParserContext, tokenText: string): void => {
  if (context.captureCss) {
    context.cssContent += tokenText
    return
  }
  if (context.captureJs) {
    context.jsContent += tokenText
    return
  }
  if (context.skipDepth === 0) {
    context.current.childCount++
    context.dom.push(text(ParseText.parseText(tokenText)))
  }
}

const handleTagNameEndToken = (context: ParserContext): void => {
  const tagNameToClose = context.tagStack.pop()?.toLowerCase() || ''
  if (TAGS_TO_CAPTURE_AS_CSS.has(tagNameToClose)) {
    finalizeCapturedCss(context)
    return
  }
  if (TAGS_TO_CAPTURE_AS_JS.has(tagNameToClose)) {
    finalizeCapturedScript(context)
    return
  }
  if (tagNameToClose === 'link' && context.captureStylesheetLink) {
    finalizeStylesheetLink(context)
    return
  }
  if (TAGS_TO_SKIP_COMPLETELY.has(tagNameToClose)) {
    context.skipDepth--
    return
  }
  if (TAGS_TO_SKIP_TAG_ONLY.has(tagNameToClose)) {
    return
  }
  closeCurrentNode(context)
}

const openRegularTag = (context: ParserContext, tokenText: string): void => {
  context.current.childCount++
  const newNode: MutableVirtualDomNode = {
    childCount: 0,
    type: GetVirtualDomTag.getVirtualDomTag(tokenText),
  }
  context.dom.push(newNode)
  context.current = newNode
  if (!context.lastTagWasSelfClosing) {
    context.stack.push(newNode)
    context.tagStack.push(tokenText)
  }
}

const handleTagNameStartToken = (context: ParserContext, tokenText: string): void => {
  const tagNameLower = tokenText.toLowerCase()
  context.lastTagWasSelfClosing = IsSelfClosingTag.isSelfClosingTag(tokenText)
  if (TAGS_TO_CAPTURE_AS_CSS.has(tagNameLower)) {
    context.captureCss = true
    context.cssContent = ''
    context.tagStack.push(tokenText)
    return
  }
  if (TAGS_TO_CAPTURE_AS_JS.has(tagNameLower)) {
    context.captureJs = true
    context.jsContent = ''
    context.scriptSrc = ''
    context.captureScriptAttributes = true
    context.tagStack.push(tokenText)
    return
  }
  if (tagNameLower === 'link') {
    context.captureStylesheetLink = true
    context.stylesheetHref = ''
    context.stylesheetRel = ''
    if (!context.lastTagWasSelfClosing) {
      context.tagStack.push(tokenText)
    }
    return
  }
  if (TAGS_TO_SKIP_COMPLETELY.has(tagNameLower)) {
    if (!context.lastTagWasSelfClosing) {
      context.skipDepth++
      context.tagStack.push(tokenText)
    }
    return
  }
  if (TAGS_TO_SKIP_TAG_ONLY.has(tagNameLower)) {
    if (!context.lastTagWasSelfClosing) {
      context.tagStack.push(tokenText)
    }
    return
  }
  if (context.skipDepth === 0) {
    openRegularTag(context, tokenText)
  }
}

const handleWhitespaceInsideOpeningTagToken = (context: ParserContext): void => {
  if (context.captureStylesheetLink && context.attributeName) {
    setStylesheetAttribute(context, context.attributeName, context.attributeName)
    context.attributeName = ''
    return
  }
  if (context.captureScriptAttributes && context.attributeName) {
    setScriptAttribute(context, context.attributeName, context.attributeName)
    context.attributeName = ''
    return
  }
  if (canCaptureDomAttributes(context)) {
    flushBooleanAttribute(context)
  }
}

const handleToken = (context: ParserContext, token: { readonly text: string; readonly type: number }): void => {
  switch (token.type) {
    case HtmlTokenType.AttributeName:
      handleAttributeNameToken(context, token.text)
      return
    case HtmlTokenType.AttributeValue:
      handleAttributeValueToken(context, token.text)
      return
    case HtmlTokenType.ClosingAngleBracket:
      handleClosingAngleBracketToken(context)
      return
    case HtmlTokenType.Content:
      handleContentToken(context, token.text)
      return
    case HtmlTokenType.TagNameEnd:
      handleTagNameEndToken(context)
      return
    case HtmlTokenType.TagNameStart:
      handleTagNameStartToken(context, token.text)
      return
    case HtmlTokenType.WhitespaceInsideOpeningTag:
      handleWhitespaceInsideOpeningTagToken(context)
      return
    default:
      return
  }
}

const createParserContext = (allowedAttributes: readonly string[], defaultAllowedAttributes: readonly string[]): ParserContext => {
  const root: MutableVirtualDomNode = {
    childCount: 0,
    type: 0,
  }
  return {
    allAllowedAttributes: new Set([...defaultAllowedAttributes, ...allowedAttributes]),
    attributeName: '',
    captureCss: false,
    captureJs: false,
    captureScriptAttributes: false,
    captureStylesheetLink: false,
    css: [],
    cssContent: '',
    current: root,
    defaultAllowedAttributes,
    dom: [],
    jsContent: '',
    lastTagWasSelfClosing: false,
    root,
    scripts: [],
    scriptSrc: '',
    scriptTags: [],
    skipDepth: 0,
    stack: [root],
    stylesheetHref: '',
    stylesheetRel: '',
    styleSheets: [],
    stylesheets: [],
    tagStack: [],
    useBuiltInDefaults: allowedAttributes.length === 0,
  }
}

export const parseHtml = (html: string, allowedAttributes: readonly string[] = [], defaultAllowedAttributes: readonly string[] = []): ParseResult => {
  Assert.string(html)
  Assert.array(allowedAttributes)
  Assert.array(defaultAllowedAttributes)

  const tokens = TokenizeHtml.tokenizeHtml(html)
  const context = createParserContext(allowedAttributes, defaultAllowedAttributes)

  for (const token of tokens) {
    handleToken(context, token)
  }
  try {
    Object.defineProperty(context.dom, 'rootChildCount', {
      configurable: true,
      enumerable: false,
      value: context.root.childCount,
    })
  } catch {
    ;(context.dom as any).rootChildCount = context.root.childCount
  }

  return {
    css: context.css,
    dom: context.dom,
    scripts: context.scripts,
    scriptTags: context.scriptTags,
    styleSheets: context.styleSheets,
    stylesheets: context.stylesheets,
  }
}

// Test helper: returns just the DOM array for backward compatibility with existing tests
export const parseHtmlDom = (
  html: string,
  allowedAttributes: readonly string[] = [],
  defaultAllowedAttributes: readonly string[] = [],
): readonly VirtualDomNode[] => {
  return parseHtml(html, allowedAttributes, defaultAllowedAttributes).dom
}
