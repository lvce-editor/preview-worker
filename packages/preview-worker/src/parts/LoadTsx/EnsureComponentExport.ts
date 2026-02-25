export const ensureComponentExport = (source: string): string => {
  if (source.includes('export const Component')) {
    return source.replaceAll(/\bexport\s+const\s+Component\b/g, 'const Component')
  }

  throw new Error('TSX preview requires `export const Component = () => ...`')
}
