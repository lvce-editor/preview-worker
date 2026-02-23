import { hasScheme } from '../HasScheme/HasScheme'

export const toBaseUrl = (uri: string): string => {
  if (hasScheme(uri)) {
    return uri
  }
  return `file://${uri}`
}
