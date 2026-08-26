import type { HtmlToken } from '../HtmlToken/HtmlToken.ts'
import * as Assert from '../Assert/Assert.ts'
import * as TokenType from '../HtmlTokenType/HtmlTokenType.ts'
import { UnexpectedTokenError } from '../UnexpectedTokenError/UnexpectedTokenError.ts'

const State = {
  AfterAttributeEqualSign: 8,
  AfterAttributeName: 7,
  AfterAttributeValueClosingQuote: 11,
  AfterAttributeValueInsideDoubleQuote: 10,
  AfterAttributeValueInsideSingleQuote: 19,
  AfterClosingTagName: 5,
  AfterClosingTagSlash: 4,
  AfterExclamationMark: 16,
  AfterOpeningAngleBracket: 2,
  InsideAttributeAfterDoubleQuote: 9,
  InsideAttributeAfterSingleQuote: 20,
  InsideComment: 17,
  InsideOpeningTag: 3,
  InsideOpeningTagAfterWhitespace: 6,
  InsideRawTextElement: 18,
  TopLevelContent: 1,
}

type StateValue = (typeof State)[keyof typeof State]

type Transition = {
  readonly match: RegExpMatchArray
  readonly nextState: StateValue
  readonly rawTextTagName?: string
  readonly token: number
}

type Context = {
  index: number
  rawTextTagName: string
  state: StateValue
  text: string
  tokens: HtmlToken[]
}

type Matcher = {
  readonly nextState: StateValue
  readonly regex: RegExp
  readonly token: number
}

const RAW_TEXT_ELEMENTS = new Set(['script', 'style'])

const RE_ANGLE_BRACKET_OPEN = /^</
const RE_ANGLE_BRACKET_OPEN_TAG = /^<(?![%\s])/
const RE_ANGLE_BRACKET_CLOSE = /^>/
const RE_SLASH = /^\//
const RE_TAGNAME = /^[a-zA-Z\d$]+/
const RE_CONTENT = /^[^<>]+/
const RE_WHITESPACE = /^\s+/
const RE_ATTRIBUTE_NAME = /^[a-zA-Z\d-]+/
const RE_EQUAL_SIGN = /^=/
const RE_DOUBLE_QUOTE = /^"/
const RE_SINGLE_QUOTE = /^'/
const RE_ATTRIBUTE_VALUE_INSIDE_DOUBLE_QUOTE = /^[^"\n]+/
const RE_ATTRIBUTE_VALUE_INSIDE_SINGLE_QUOTE = /^[^'\n]+/
const RE_TEXT = /^[^<>]+/
const RE_EXCLAMATION_MARK = /^!/
const RE_DASH_DASH = /^--/
const RE_DOCTYPE = /^doctype/i
const RE_BLOCK_COMMENT_CONTENT = /^(?:(?!-->)[\s\S])+/
const RE_COMMENT_END = /^-->/
const RE_TAG_TEXT = /^[^\s>]+/
const RE_ANY_TEXT = /^[^\n]+/
const RE_ATTRIBUTE_TEXT = /^[^\s<>/]+/
const RE_BLOCK_COMMENT_START = /^<!--/
const RE_SELF_CLOSING = /^\/>/

const matchTransition = (part: string, matchers: readonly Matcher[]): Transition => {
  for (const matcher of matchers) {
    const match = part.match(matcher.regex)
    if (match) {
      return {
        match,
        nextState: matcher.nextState,
        token: matcher.token,
      }
    }
  }
  throw new UnexpectedTokenError()
}

const handleAfterAttributeEqualSign = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.InsideAttributeAfterDoubleQuote, regex: RE_DOUBLE_QUOTE, token: TokenType.AttributeQuoteStart },
    { nextState: State.InsideAttributeAfterSingleQuote, regex: RE_SINGLE_QUOTE, token: TokenType.AttributeQuoteStart },
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
    { nextState: State.InsideOpeningTag, regex: RE_ATTRIBUTE_TEXT, token: TokenType.AttributeValue },
  ])
}

const handleAfterAttributeName = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.AfterAttributeEqualSign, regex: RE_EQUAL_SIGN, token: TokenType.AttributeEqualSign },
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
    { nextState: State.InsideOpeningTagAfterWhitespace, regex: RE_WHITESPACE, token: TokenType.WhitespaceInsideOpeningTag },
    { nextState: State.AfterOpeningAngleBracket, regex: RE_ANGLE_BRACKET_OPEN, token: TokenType.OpeningAngleBracket },
  ])
}

const handleAfterAttributeValueClosingQuote = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
    { nextState: State.InsideOpeningTagAfterWhitespace, regex: RE_WHITESPACE, token: TokenType.WhitespaceInsideOpeningTag },
    { nextState: State.TopLevelContent, regex: RE_SELF_CLOSING, token: TokenType.ClosingAngleBracket },
  ])
}

const handleAfterAttributeValueInsideDoubleQuote = (part: string): Transition => {
  return matchTransition(part, [{ nextState: State.AfterAttributeValueClosingQuote, regex: RE_DOUBLE_QUOTE, token: TokenType.AttributeQuoteEnd }])
}

const handleAfterAttributeValueInsideSingleQuote = (part: string): Transition => {
  return matchTransition(part, [{ nextState: State.AfterAttributeValueClosingQuote, regex: RE_SINGLE_QUOTE, token: TokenType.AttributeQuoteEnd }])
}

const handleAfterClosingTagName = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
    { nextState: State.TopLevelContent, regex: RE_WHITESPACE, token: TokenType.Content },
  ])
}

const handleAfterClosingTagSlash = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.AfterClosingTagName, regex: RE_TAGNAME, token: TokenType.TagNameEnd },
    { nextState: State.TopLevelContent, regex: RE_WHITESPACE, token: TokenType.WhitespaceAfterClosingTagSlash },
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
  ])
}

const handleAfterExclamationMark = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.InsideComment, regex: RE_DASH_DASH, token: TokenType.StartCommentDashes },
    { nextState: State.InsideOpeningTag, regex: RE_DOCTYPE, token: TokenType.Doctype },
  ])
}

const handleAfterOpeningAngleBracket = (part: string): Transition => {
  const tagNameMatch = part.match(RE_TAGNAME)
  if (tagNameMatch) {
    const rawTextTagName = RAW_TEXT_ELEMENTS.has(tagNameMatch[0].toLowerCase()) ? tagNameMatch[0].toLowerCase() : ''
    return {
      match: tagNameMatch,
      nextState: State.InsideOpeningTag,
      rawTextTagName,
      token: TokenType.TagNameStart,
    }
  }
  return matchTransition(part, [
    { nextState: State.AfterClosingTagSlash, regex: RE_SLASH, token: TokenType.ClosingTagSlash },
    { nextState: State.TopLevelContent, regex: RE_WHITESPACE, token: TokenType.WhitespaceAfterOpeningTagOpenAngleBracket },
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
    { nextState: State.AfterExclamationMark, regex: RE_EXCLAMATION_MARK, token: TokenType.ExclamationMark },
    { nextState: State.TopLevelContent, regex: RE_ANY_TEXT, token: TokenType.Text },
  ])
}

const handleInsideAttributeAfterDoubleQuote = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.AfterAttributeValueInsideDoubleQuote, regex: RE_ATTRIBUTE_VALUE_INSIDE_DOUBLE_QUOTE, token: TokenType.AttributeValue },
    { nextState: State.AfterAttributeValueClosingQuote, regex: RE_DOUBLE_QUOTE, token: TokenType.AttributeQuoteEnd },
  ])
}

const handleInsideAttributeAfterSingleQuote = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.AfterAttributeValueInsideSingleQuote, regex: RE_ATTRIBUTE_VALUE_INSIDE_SINGLE_QUOTE, token: TokenType.AttributeValue },
    { nextState: State.AfterAttributeValueClosingQuote, regex: RE_SINGLE_QUOTE, token: TokenType.AttributeQuoteEnd },
  ])
}

const handleInsideComment = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.InsideComment, regex: RE_BLOCK_COMMENT_CONTENT, token: TokenType.Comment },
    { nextState: State.TopLevelContent, regex: RE_COMMENT_END, token: TokenType.EndCommentTag },
  ])
}

const handleInsideOpeningTag = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
    { nextState: State.InsideOpeningTagAfterWhitespace, regex: RE_WHITESPACE, token: TokenType.WhitespaceInsideOpeningTag },
    { nextState: State.TopLevelContent, regex: RE_TAG_TEXT, token: TokenType.Text },
  ])
}

const handleInsideOpeningTagAfterWhitespace = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.AfterAttributeName, regex: RE_ATTRIBUTE_NAME, token: TokenType.AttributeName },
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.ClosingAngleBracket },
    { nextState: State.TopLevelContent, regex: RE_SELF_CLOSING, token: TokenType.ClosingAngleBracket },
    { nextState: State.AfterAttributeName, regex: RE_TEXT, token: TokenType.AttributeName },
  ])
}

const handleTopLevelContent = (part: string): Transition => {
  return matchTransition(part, [
    { nextState: State.AfterOpeningAngleBracket, regex: RE_ANGLE_BRACKET_OPEN_TAG, token: TokenType.OpeningAngleBracket },
    { nextState: State.TopLevelContent, regex: RE_CONTENT, token: TokenType.Content },
    { nextState: State.InsideComment, regex: RE_BLOCK_COMMENT_START, token: TokenType.CommentStart },
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_CLOSE, token: TokenType.Content },
    { nextState: State.TopLevelContent, regex: RE_ANGLE_BRACKET_OPEN, token: TokenType.Text },
  ])
}

const getTransition = (context: Context, part: string): Transition => {
  switch (context.state) {
    case State.AfterAttributeEqualSign:
      return handleAfterAttributeEqualSign(part)
    case State.AfterAttributeName:
      return handleAfterAttributeName(part)
    case State.AfterAttributeValueClosingQuote:
      return handleAfterAttributeValueClosingQuote(part)
    case State.AfterAttributeValueInsideDoubleQuote:
      return handleAfterAttributeValueInsideDoubleQuote(part)
    case State.AfterAttributeValueInsideSingleQuote:
      return handleAfterAttributeValueInsideSingleQuote(part)
    case State.AfterClosingTagName:
      return handleAfterClosingTagName(part)
    case State.AfterClosingTagSlash:
      return handleAfterClosingTagSlash(part)
    case State.AfterExclamationMark:
      return handleAfterExclamationMark(part)
    case State.AfterOpeningAngleBracket:
      return handleAfterOpeningAngleBracket(part)
    case State.InsideAttributeAfterDoubleQuote:
      return handleInsideAttributeAfterDoubleQuote(part)
    case State.InsideAttributeAfterSingleQuote:
      return handleInsideAttributeAfterSingleQuote(part)
    case State.InsideComment:
      return handleInsideComment(part)
    case State.InsideOpeningTag:
      return handleInsideOpeningTag(part)
    case State.InsideOpeningTagAfterWhitespace:
      return handleInsideOpeningTagAfterWhitespace(part)
    case State.TopLevelContent:
      return handleTopLevelContent(part)
    default:
      throw new UnexpectedTokenError()
  }
}

const appendToken = (context: Context, textValue: string, type: number): void => {
  context.tokens.push({
    text: textValue,
    type,
  })
}

const consumeRawTextElement = (context: Context): void => {
  const part = context.text.slice(context.index)
  const closingTagPattern = new RegExp(`^([\\s\\S]*?)(<\\/${context.rawTextTagName}>)`, 'i')
  const rawMatch = part.match(closingTagPattern)
  if (!rawMatch) {
    appendToken(context, part, TokenType.Content)
    context.index = context.text.length
    context.rawTextTagName = ''
    context.state = State.TopLevelContent
    return
  }
  if (rawMatch[1].length > 0) {
    appendToken(context, rawMatch[1], TokenType.Content)
    context.index += rawMatch[1].length
  }
  appendToken(context, '<', TokenType.OpeningAngleBracket)
  context.index += 1
  appendToken(context, '/', TokenType.ClosingTagSlash)
  context.index += 1
  appendToken(context, context.rawTextTagName, TokenType.TagNameEnd)
  context.index += context.rawTextTagName.length
  appendToken(context, '>', TokenType.ClosingAngleBracket)
  context.index += 1
  context.rawTextTagName = ''
  context.state = State.TopLevelContent
}

const shouldEnterRawTextState = (rawTextTagName: string, transition: Transition): boolean => {
  return rawTextTagName !== '' && transition.token === TokenType.ClosingAngleBracket && transition.nextState === State.TopLevelContent
}

export const tokenizeHtml = (text: string): readonly HtmlToken[] => {
  Assert.string(text)
  const context: Context = {
    index: 0,
    rawTextTagName: '',
    state: State.TopLevelContent,
    text,
    tokens: [],
  }

  while (context.index < text.length) {
    if (context.state === State.InsideRawTextElement) {
      consumeRawTextElement(context)
      continue
    }

    const part = text.slice(context.index)
    const transition = getTransition(context, part)
    const tokenText = transition.match[0]
    const rawTextTagName = transition.rawTextTagName ?? context.rawTextTagName

    appendToken(context, tokenText, transition.token)
    context.index += tokenText.length
    context.rawTextTagName = rawTextTagName
    context.state = shouldEnterRawTextState(rawTextTagName, transition) ? State.InsideRawTextElement : transition.nextState
  }

  return context.tokens
}
