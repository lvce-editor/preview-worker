import { hasScheme } from './HasScheme'

export const toBaseUrl = (uri: string): string => {
  if (hasScheme(uri)) {
    return uri
  }
  return `file://${uri}`
}

export default toBaseUrl
