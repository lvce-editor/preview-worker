import { hasScheme } from '../HasScheme/HasScheme.js'

export const toBaseUrl = (uri: string): string => {
  if (hasScheme(uri)) {
    return uri
  }
  return `file://${uri}`
}
