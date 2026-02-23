import { hasScheme } from '../HasScheme/HasScheme.ts'

export const toBaseUrl = (uri: string): string => {
  if (hasScheme(uri)) {
    return uri
  }
  return `file://${uri}`
}

export default toBaseUrl
