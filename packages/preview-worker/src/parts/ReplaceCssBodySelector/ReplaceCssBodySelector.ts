const PREVIEW_SELECTOR = '.Preview'
const HTML_SELECTOR = '.Preview .Html'
const ROOT_SELECTOR = PREVIEW_SELECTOR

const startsWithRootPseudoSelector = (selector: string): boolean => {
  return selector.toLowerCase().startsWith(':root') && !isIdentifierChar(selector[5])
}

const replaceRootPseudoSelector = (selector: string): string => {
  const normalizedHtmlRootSelector = `${HTML_SELECTOR}:root`
  if (selector.toLowerCase().startsWith(normalizedHtmlRootSelector.toLowerCase()) && !isIdentifierChar(selector[normalizedHtmlRootSelector.length])) {
    return `${ROOT_SELECTOR}${selector.slice(normalizedHtmlRootSelector.length)}`
  }
  if (startsWithRootPseudoSelector(selector)) {
    return `${ROOT_SELECTOR}${selector.slice(5)}`
  }
  return selector
}

const isIdentifierChar = (char: string | undefined): boolean => {
  if (!char) {
    return false
  }
  return /[a-zA-Z0-9_-]/.test(char)
}

const isLikelyTypeSelectorStart = (selector: string, tokenStart: number): boolean => {
  if (tokenStart === 0) {
    return true
  }
  const previous = selector[tokenStart - 1]
  return /[\s,+>~(|&]/.test(previous)
}

const isQuoteChar = (char: string | undefined): boolean => {
  return char === '"' || char === "'"
}

const isCommentStart = (value: string, index: number): boolean => {
  return value[index] === '/' && value[index + 1] === '*'
}

const getCommentEnd = (value: string, index: number): number => {
  const end = value.indexOf('*/', index + 2)
  return end === -1 ? value.length : end + 2
}

const getQuotedEnd = (value: string, index: number): number => {
  const quote = value[index]
  let current = index + 1
  while (current < value.length) {
    if (value[current] === '\\') {
      current += 2
      continue
    }
    if (value[current] === quote) {
      return current + 1
    }
    current++
  }
  return current
}

const getSkippedSegmentEnd = (value: string, index: number): number | undefined => {
  if (isCommentStart(value, index)) {
    return getCommentEnd(value, index)
  }
  if (isQuoteChar(value[index])) {
    return getQuotedEnd(value, index)
  }
  return undefined
}

const getIdentifierEnd = (value: string, index: number): number => {
  let current = index + 1
  while (current < value.length && isIdentifierChar(value[current])) {
    current++
  }
  return current
}

const getNextBracketDepth = (bracketsDepth: number, char: string): number | undefined => {
  if (char === '[') {
    return bracketsDepth + 1
  }
  if (char === ']') {
    return Math.max(0, bracketsDepth - 1)
  }
  return undefined
}

const getTypeSelectorReplacement = (selector: string, index: number, bracketsDepth: number): { nextIndex: number; text: string } | undefined => {
  const char = selector[index]
  if (bracketsDepth !== 0 || !/[a-zA-Z_-]/.test(char)) {
    return undefined
  }
  const identifierEnd = getIdentifierEnd(selector, index)
  const token = selector.slice(index, identifierEnd)
  const lowerToken = token.toLowerCase()
  const shouldReplace = (lowerToken === 'html' || lowerToken === 'body') && isLikelyTypeSelectorStart(selector, index)
  return {
    nextIndex: identifierEnd,
    text: shouldReplace ? HTML_SELECTOR : token,
  }
}

const getNextSelectorDepths = (
  parenthesesDepth: number,
  bracketsDepth: number,
  char: string,
): { bracketsDepth: number; parenthesesDepth: number } | undefined => {
  if (char === '(') {
    return { bracketsDepth, parenthesesDepth: parenthesesDepth + 1 }
  }
  if (char === ')') {
    return { bracketsDepth, parenthesesDepth: Math.max(0, parenthesesDepth - 1) }
  }
  const nextBracketDepth = getNextBracketDepth(bracketsDepth, char)
  if (nextBracketDepth === undefined) {
    return undefined
  }
  return { bracketsDepth: nextBracketDepth, parenthesesDepth }
}

const isTopLevelPreviewMatch = (selector: string, index: number): boolean => {
  if (!selector.startsWith(PREVIEW_SELECTOR, index)) {
    return false
  }
  if (index === 0) {
    return true
  }
  return /[\s>+~,&|]/.test(selector[index - 1])
}

const replaceHtmlAndBodyTypeSelectors = (selector: string): string => {
  let result = ''
  let bracketsDepth = 0

  let index = 0
  while (index < selector.length) {
    const char = selector[index]

    const skippedSegmentEnd = getSkippedSegmentEnd(selector, index)
    if (skippedSegmentEnd !== undefined) {
      result += selector.slice(index, skippedSegmentEnd)
      index = skippedSegmentEnd
      continue
    }

    const nextBracketDepth = getNextBracketDepth(bracketsDepth, char)
    if (nextBracketDepth !== undefined) {
      bracketsDepth = nextBracketDepth
      result += char
      index++
      continue
    }

    const replacement = getTypeSelectorReplacement(selector, index, bracketsDepth)
    if (replacement) {
      result += replacement.text
      index = replacement.nextIndex
      continue
    }

    result += char
    index++
  }

  return result
}

const hasTopLevelPreviewAnchor = (selector: string): boolean => {
  let parenthesesDepth = 0
  let bracketsDepth = 0

  let index = 0
  while (index < selector.length) {
    const char = selector[index]

    const skippedSegmentEnd = getSkippedSegmentEnd(selector, index)
    if (skippedSegmentEnd !== undefined) {
      index = skippedSegmentEnd
      continue
    }

    const nextDepths = getNextSelectorDepths(parenthesesDepth, bracketsDepth, char)
    if (nextDepths) {
      ;({ bracketsDepth, parenthesesDepth } = nextDepths)
      index++
      continue
    }

    if (parenthesesDepth !== 0 || bracketsDepth !== 0) {
      index++
      continue
    }

    if (isTopLevelPreviewMatch(selector, index)) {
      return true
    }

    index++
  }

  return false
}

const isAlreadyScopedSelector = (selector: string): boolean => {
  const trimmed = selector.trim()
  return hasTopLevelPreviewAnchor(trimmed)
}

const splitByCommaAtTopLevel = (selectorText: string): readonly string[] => {
  const selectors: string[] = []
  let current = ''
  let parenthesesDepth = 0
  let bracketsDepth = 0

  let index = 0
  while (index < selectorText.length) {
    const char = selectorText[index]

    const skippedSegmentEnd = getSkippedSegmentEnd(selectorText, index)
    if (skippedSegmentEnd !== undefined) {
      current += selectorText.slice(index, skippedSegmentEnd)
      index = skippedSegmentEnd
      continue
    }

    const nextDepths = getNextSelectorDepths(parenthesesDepth, bracketsDepth, char)
    if (nextDepths) {
      ;({ bracketsDepth, parenthesesDepth } = nextDepths)
      current += char
      index++
      continue
    }

    if (char === ',' && parenthesesDepth === 0 && bracketsDepth === 0) {
      selectors.push(current)
      current = ''
      index++
      continue
    }

    current += char
    index++
  }

  selectors.push(current)
  return selectors
}

const scopeSingleSelector = (selector: string): string => {
  const trimmed = selector.trim()
  if (!trimmed) {
    return ''
  }

  const normalized = replaceRootPseudoSelector(replaceHtmlAndBodyTypeSelectors(trimmed))

  if (isAlreadyScopedSelector(normalized)) {
    return normalized
  }

  return `${PREVIEW_SELECTOR} ${normalized}`
}

const scopeSelectorList = (selectorList: string): string => {
  const selectors = splitByCommaAtTopLevel(selectorList)
  const scopedSelectors = selectors.map(scopeSingleSelector).filter(Boolean)
  return scopedSelectors.join(', ')
}

const findBlockEnd = (css: string, blockStart: number): number => {
  let depth = 1

  let index = blockStart + 1
  while (index < css.length) {
    const char = css[index]

    if (isCommentStart(css, index)) {
      index = getCommentEnd(css, index)
      continue
    }

    if (isQuoteChar(char)) {
      index = getQuotedEnd(css, index)
      continue
    }

    if (char === '{') {
      depth++
      index++
      continue
    }

    if (char === '}') {
      depth--
      if (depth === 0) {
        return index
      }
    }

    index++
  }

  return -1
}

const shouldScopeNestedAtRule = (prelude: string): boolean => {
  const lowerPrelude = prelude.trim().toLowerCase()
  return (
    lowerPrelude.startsWith('@media') ||
    lowerPrelude.startsWith('@supports') ||
    lowerPrelude.startsWith('@container') ||
    lowerPrelude.startsWith('@layer') ||
    lowerPrelude.startsWith('@scope') ||
    lowerPrelude.startsWith('@document')
  )
}

const formatRule = (prelude: string, block: string): string => {
  const startsWithNewline = block.startsWith('\n') || block.startsWith('\r')
  if (startsWithNewline) {
    return `${prelude} {${block} }`
  }
  return `${prelude} { ${block} }`
}

const skipRuleSeparators = (css: string, index: number): number => {
  let current = index
  while (current < css.length) {
    if (css[current] === '}' || /\s/.test(css[current])) {
      current++
      continue
    }
    if (isCommentStart(css, current)) {
      current = getCommentEnd(css, current)
      continue
    }
    break
  }
  return current
}

const findRuleDelimiter = (css: string, index: number): { delimiter: ';' | '{'; index: number } | undefined => {
  let parenthesesDepth = 0
  let bracketsDepth = 0
  let current = index

  while (current < css.length) {
    const char = css[current]

    const skippedSegmentEnd = getSkippedSegmentEnd(css, current)
    if (skippedSegmentEnd !== undefined) {
      current = skippedSegmentEnd
      continue
    }

    const nextDepths = getNextSelectorDepths(parenthesesDepth, bracketsDepth, char)
    if (nextDepths) {
      ;({ bracketsDepth, parenthesesDepth } = nextDepths)
      current++
      continue
    }

    if (parenthesesDepth === 0 && bracketsDepth === 0 && (char === '{' || char === ';')) {
      return {
        delimiter: char,
        index: current,
      }
    }

    current++
  }

  return undefined
}

const getScopedAtRule = (prelude: string, block: string): string | undefined => {
  if (!shouldScopeNestedAtRule(prelude)) {
    return formatRule(prelude, block)
  }
  const scopedBlock = scopeCss(block)
  return scopedBlock ? formatRule(prelude, scopedBlock) : undefined
}

const getScopedRule = (prelude: string, block: string): string | undefined => {
  if (!prelude) {
    return undefined
  }

  if (prelude.startsWith('@')) {
    return getScopedAtRule(prelude, block)
  }

  const scopedPrelude = scopeSelectorList(prelude)
  return scopedPrelude ? formatRule(scopedPrelude, block) : undefined
}

const scopeCss = (css: string): string => {
  const rules: string[] = []
  let index = 0

  while (index < css.length) {
    index = skipRuleSeparators(css, index)
    if (index >= css.length) {
      break
    }

    const delimiter = findRuleDelimiter(css, index)
    if (!delimiter) {
      break
    }

    if (delimiter.delimiter === ';') {
      const statement = css.slice(index, delimiter.index + 1).trim()
      if (statement) {
        rules.push(statement)
      }
      index = delimiter.index + 1
      continue
    }

    const prelude = css.slice(index, delimiter.index).trim()
    const blockEnd = findBlockEnd(css, delimiter.index)
    if (blockEnd === -1) {
      break
    }

    const block = css.slice(delimiter.index + 1, blockEnd)
    const scopedRule = getScopedRule(prelude, block)
    if (scopedRule) {
      rules.push(scopedRule)
    }

    index = blockEnd + 1
  }

  return rules.join(' ')
}

export const replaceCssBodySelector = (css: string): string => {
  if (!css.trim()) {
    return css
  }
  return scopeCss(css)
}
