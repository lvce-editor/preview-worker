const getUriPath = (uri: string): string => {
  const withoutHash = uri.split('#', 1)[0]
  const withoutQuery = withoutHash.split('?', 1)[0]

  if (withoutQuery.startsWith('file://')) {
    try {
      return decodeURIComponent(new URL(withoutQuery).pathname)
    } catch {
      return withoutQuery
    }
  }

  return withoutQuery
}

export const isTsxUri = (uri: string): boolean => {
  const path = getUriPath(uri).toLowerCase()
  return path.endsWith('.tsx') || path.endsWith('.jsx')
}
