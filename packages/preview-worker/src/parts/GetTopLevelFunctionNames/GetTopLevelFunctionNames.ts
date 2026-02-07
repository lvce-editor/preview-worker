const FUNCTION_REGEX = /(?:^|[\n;])\s*function\s+([a-zA-Z_$][\w$]*)/g

export const getTopLevelFunctionNames = (script: string): readonly string[] => {
  const names: string[] = []
  let match
  while ((match = FUNCTION_REGEX.exec(script)) !== null) {
    names.push(match[1])
  }
  return names
}
