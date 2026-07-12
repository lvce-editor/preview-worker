// const FUNCTION_REGEX = /(?:^|[\n;])\s*function\s+([a-zA-Z_$][\w$]*)/g

const skipQuotedString = (script: string, start: number): number => {
  const quote = script[start]
  let index = start + 1
  while (index < script.length) {
    if (script[index] === '\\') {
      index += 2
      continue
    }
    if (script[index] === quote) {
      return index + 1
    }
    index++
  }
  return index
}

const skipLineComment = (script: string, start: number): number => {
  let index = start + 2
  while (index < script.length && script[index] !== '\n') {
    index++
  }
  return index
}

const skipBlockComment = (script: string, start: number): number => {
  let index = start + 2
  while (index < script.length - 1) {
    if (script[index] === '*' && script[index + 1] === '/') {
      return index + 2
    }
    index++
  }
  return index
}

const getFunctionNameAt = (script: string, start: number): string | undefined => {
  if (script.slice(start, start + 8) !== 'function') {
    return undefined
  }
  const charBefore = start > 0 ? script[start - 1] : ' '
  const charAfter = script[start + 8] ?? ' '
  const isValidBefore = /\s|^|;|{|}/.test(charBefore)
  const isValidAfter = /\s/.test(charAfter)
  if (!isValidBefore || !isValidAfter) {
    return undefined
  }
  const remainder = script.slice(start + 8).trimStart()
  return remainder.match(/^([a-zA-Z_$][\w$]*)/)?.[1]
}

const getIgnoredSegmentEnd = (script: string, index: number): number => {
  const char = script[index]
  if (['"', "'", '`'].includes(char)) {
    return skipQuotedString(script, index)
  }
  if (char === '/' && script[index + 1] === '/') {
    return skipLineComment(script, index)
  }
  if (char === '/' && script[index + 1] === '*') {
    return skipBlockComment(script, index)
  }
  return index
}

const getBraceDepthDelta = (char: string): number => {
  if (char === '{') {
    return 1
  }
  if (char === '}') {
    return -1
  }
  return 0
}

export const getTopLevelFunctionNames = (script: string): readonly string[] => {
  const names: string[] = []
  let braceDepth = 0
  let i = 0

  while (i < script.length) {
    const ignoredSegmentEnd = getIgnoredSegmentEnd(script, i)
    if (ignoredSegmentEnd !== i) {
      i = ignoredSegmentEnd
      continue
    }

    const char = script[i]
    const braceDepthDelta = getBraceDepthDelta(char)
    if (braceDepthDelta !== 0) {
      braceDepth += braceDepthDelta
      i++
      continue
    }

    if (braceDepth !== 0 || char !== 'f') {
      i++
      continue
    }

    const functionName = getFunctionNameAt(script, i)
    if (functionName) {
      names.push(functionName)
      i += 8
      continue
    }

    i++
  }

  return names
}
