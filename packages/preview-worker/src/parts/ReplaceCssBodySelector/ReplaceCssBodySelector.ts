const PREVIEW_SELECTOR = '.Preview'
const HTML_SELECTOR = '.Preview .Html'

const startsWithRootPseudoSelector = (selector: string): boolean => {
  return selector.toLowerCase().startsWith(':root') && !isIdentifierChar(selector[5])
}

const replaceRootPseudoSelector = (selector: string): string => {
  const normalizedHtmlRootSelector = `${HTML_SELECTOR}:root`
  if (selector.toLowerCase().startsWith(normalizedHtmlRootSelector.toLowerCase()) && !isIdentifierChar(selector[normalizedHtmlRootSelector.length])) {
    return `${HTML_SELECTOR}${selector.slice(normalizedHtmlRootSelector.length)}`
  }
  if (startsWithRootPseudoSelector(selector)) {
    return `${HTML_SELECTOR}${selector.slice(5)}`
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

const replaceHtmlAndBodyTypeSelectors = (selector: string): string => {
  let result = ''
  let quote: string | undefined
  let inComment = false
  let bracketsDepth = 0

  for (let i = 0; i < selector.length; i++) {
    const char = selector[i]
    const next = selector[i + 1]

    if (inComment) {
      result += char
      if (char === '*' && next === '/') {
        result += '/'
        i++
        inComment = false
      }
      continue
    }

    if (quote) {
      result += char
      if (char === '\\') {
        const escaped = selector[i + 1]
        if (escaped) {
          result += escaped
          i++
        }
        continue
      }
      if (char === quote) {
        quote = undefined
      }
      continue
    }

    if (char === '/' && next === '*') {
      result += '/*'
      i++
      inComment = true
      continue
    }

    if (char === '"' || char === "'") {
      result += char
      quote = char
      continue
    }

    if (char === '[') {
      bracketsDepth++
      result += char
      continue
    }

    if (char === ']') {
      bracketsDepth = Math.max(0, bracketsDepth - 1)
      result += char
      continue
    }

    if (bracketsDepth === 0 && /[a-zA-Z_-]/.test(char)) {
      let j = i + 1
      while (j < selector.length && isIdentifierChar(selector[j])) {
        j++
      }

      const token = selector.slice(i, j)
      const lowerToken = token.toLowerCase()
      const shouldReplace = (lowerToken === 'html' || lowerToken === 'body') && isLikelyTypeSelectorStart(selector, i)

      if (shouldReplace) {
        result += HTML_SELECTOR
      } else {
        result += token
      }
      i = j - 1
      continue
    }

    result += char
  }

  return result
}

const hasTopLevelPreviewAnchor = (selector: string): boolean => {
  let quote: string | undefined
  let inComment = false
  let parenthesesDepth = 0
  let bracketsDepth = 0

  for (let i = 0; i < selector.length; i++) {
    const char = selector[i]
    const next = selector[i + 1]

    if (inComment) {
      if (char === '*' && next === '/') {
        i++
        inComment = false
      }
      continue
    }

    if (quote) {
      if (char === '\\') {
        i++
        continue
      }
      if (char === quote) {
        quote = undefined
      }
      continue
    }

    if (char === '/' && next === '*') {
      i++
      inComment = true
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === '(') {
      parenthesesDepth++
      continue
    }

    if (char === ')') {
      parenthesesDepth = Math.max(0, parenthesesDepth - 1)
      continue
    }

    if (char === '[') {
      bracketsDepth++
      continue
    }

    if (char === ']') {
      bracketsDepth = Math.max(0, bracketsDepth - 1)
      continue
    }

    if (parenthesesDepth !== 0 || bracketsDepth !== 0) {
      continue
    }

    if (selector.startsWith(PREVIEW_SELECTOR, i)) {
      if (i === 0) {
        return true
      }
      const previous = selector[i - 1]
      if (/[\s>+~,&|]/.test(previous)) {
        return true
      }
    }
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
  let quote: string | undefined
  let inComment = false
  let parenthesesDepth = 0
  let bracketsDepth = 0

  for (let i = 0; i < selectorText.length; i++) {
    const char = selectorText[i]
    const next = selectorText[i + 1]

    if (inComment) {
      current += char
      if (char === '*' && next === '/') {
        current += '/'
        i++
        inComment = false
      }
      continue
    }

    if (quote) {
      current += char
      if (char === '\\') {
        const escaped = selectorText[i + 1]
        if (escaped) {
          current += escaped
          i++
        }
        continue
      }
      if (char === quote) {
        quote = undefined
      }
      continue
    }

    if (char === '/' && next === '*') {
      current += '/*'
      i++
      inComment = true
      continue
    }

    if (char === '"' || char === "'") {
      current += char
      quote = char
      continue
    }

    if (char === '(') {
      parenthesesDepth++
      current += char
      continue
    }

    if (char === ')') {
      parenthesesDepth = Math.max(0, parenthesesDepth - 1)
      current += char
      continue
    }

    if (char === '[') {
      bracketsDepth++
      current += char
      continue
    }

    if (char === ']') {
      bracketsDepth = Math.max(0, bracketsDepth - 1)
      current += char
      continue
    }

    if (char === ',' && parenthesesDepth === 0 && bracketsDepth === 0) {
      selectors.push(current)
      current = ''
      continue
    }

    current += char
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
  let quote: string | undefined
  let inComment = false
  let depth = 1

  for (let i = blockStart + 1; i < css.length; i++) {
    const char = css[i]
    const next = css[i + 1]

    if (inComment) {
      if (char === '*' && next === '/') {
        i++
        inComment = false
      }
      continue
    }

    if (quote) {
      if (char === '\\') {
        i++
        continue
      }
      if (char === quote) {
        quote = undefined
      }
      continue
    }

    if (char === '/' && next === '*') {
      i++
      inComment = true
      continue
    }

    if (char === '"' || char === "'") {
      quote = char
      continue
    }

    if (char === '{') {
      depth++
      continue
    }

    if (char === '}') {
      depth--
      if (depth === 0) {
        return i
      }
    }
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

const scopeCss = (css: string): string => {
  const rules: string[] = []
  let index = 0

  while (index < css.length) {
    while (index < css.length) {
      if (css[index] === '}' || /\s/.test(css[index])) {
        index++
        continue
      }
      if (css[index] === '/' && css[index + 1] === '*') {
        const endComment = css.indexOf('*/', index + 2)
        if (endComment === -1) {
          index = css.length
          break
        }
        index = endComment + 2
        continue
      }
      break
    }

    if (index >= css.length) {
      break
    }

    let quote: string | undefined
    let inComment = false
    let parenthesesDepth = 0
    let bracketsDepth = 0
    let delimiterIndex = -1
    let delimiter = ''

    for (let i = index; i < css.length; i++) {
      const char = css[i]
      const next = css[i + 1]

      if (inComment) {
        if (char === '*' && next === '/') {
          i++
          inComment = false
        }
        continue
      }

      if (quote) {
        if (char === '\\') {
          i++
          continue
        }
        if (char === quote) {
          quote = undefined
        }
        continue
      }

      if (char === '/' && next === '*') {
        i++
        inComment = true
        continue
      }

      if (char === '"' || char === "'") {
        quote = char
        continue
      }

      if (char === '(') {
        parenthesesDepth++
        continue
      }

      if (char === ')') {
        parenthesesDepth = Math.max(0, parenthesesDepth - 1)
        continue
      }

      if (char === '[') {
        bracketsDepth++
        continue
      }

      if (char === ']') {
        bracketsDepth = Math.max(0, bracketsDepth - 1)
        continue
      }

      if (parenthesesDepth === 0 && bracketsDepth === 0 && (char === '{' || char === ';')) {
        delimiterIndex = i
        delimiter = char
        break
      }
    }

    if (delimiterIndex === -1) {
      break
    }

    if (delimiter === ';') {
      const statement = css.slice(index, delimiterIndex + 1).trim()
      if (statement) {
        rules.push(statement)
      }
      index = delimiterIndex + 1
      continue
    }

    const prelude = css.slice(index, delimiterIndex).trim()
    const blockEnd = findBlockEnd(css, delimiterIndex)
    if (blockEnd === -1) {
      break
    }

    const block = css.slice(delimiterIndex + 1, blockEnd)
    if (!prelude) {
      index = blockEnd + 1
      continue
    }

    if (prelude.startsWith('@')) {
      if (shouldScopeNestedAtRule(prelude)) {
        const scopedBlock = scopeCss(block)
        if (scopedBlock) {
          rules.push(formatRule(prelude, scopedBlock))
        }
      } else {
        rules.push(formatRule(prelude, block))
      }
    } else {
      const scopedPrelude = scopeSelectorList(prelude)
      if (scopedPrelude) {
        rules.push(formatRule(scopedPrelude, block))
      }
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
