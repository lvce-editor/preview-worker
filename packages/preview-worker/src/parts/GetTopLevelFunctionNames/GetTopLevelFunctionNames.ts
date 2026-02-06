export const getTopLevelFunctionNames = (script: string): readonly string[] => {
  const names: string[] = []
  const regex = /(?:^|[\n;])\s*function\s+([a-zA-Z_$][\w$]*)/g
  let match
  while ((match = regex.exec(script)) !== null) {
    names.push(match[1])
  }
  return names
}
