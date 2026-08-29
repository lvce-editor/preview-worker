// cspell:ignore cqmax cqmin vmax vmin

const replacements: readonly (readonly [string, string])[] = [
  ['vmin', 'cqmin'],
  ['vmax', 'cqmax'],
  ['vw', 'cqw'],
  ['vh', 'cqh'],
]

const isCommentStart = (value: string, index: number): boolean => {
  return value[index] === '/' && value[index + 1] === '*'
}

const getCommentEnd = (value: string, index: number): number => {
  const end = value.indexOf('*/', index + 2)
  return end === -1 ? value.length : end + 2
}

const isQuote = (char: string | undefined): boolean => {
  return char === '"' || char === "'"
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
  return value.length
}

const isIdentifierChar = (char: string | undefined): boolean => {
  return Boolean(char && /[a-zA-Z0-9_-]/.test(char))
}

const getReplacement = (value: string, index: number): { readonly length: number; readonly text: string } | undefined => {
  if (!/\d/.test(value[index - 1] || '')) {
    return undefined
  }
  const lowerValue = value.slice(index).toLowerCase()
  for (const [unit, replacement] of replacements) {
    if (lowerValue.startsWith(unit) && !isIdentifierChar(value[index + unit.length])) {
      return {
        length: unit.length,
        text: replacement,
      }
    }
  }
  return undefined
}

export const replaceCssViewportUnits = (value: string): string => {
  let result = ''
  let index = 0
  while (index < value.length) {
    if (isCommentStart(value, index)) {
      const end = getCommentEnd(value, index)
      result += value.slice(index, end)
      index = end
      continue
    }
    if (isQuote(value[index])) {
      const end = getQuotedEnd(value, index)
      result += value.slice(index, end)
      index = end
      continue
    }
    const replacement = getReplacement(value, index)
    if (replacement) {
      result += replacement.text
      index += replacement.length
      continue
    }
    result += value[index]
    index++
  }
  return result
}
