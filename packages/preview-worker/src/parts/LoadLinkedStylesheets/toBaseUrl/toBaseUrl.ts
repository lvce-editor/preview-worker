import { hasScheme } from '../hasScheme/hasScheme'

export const toBaseUrl = (uri: string): string => {
  if (hasScheme(uri)) {
    return uri
  }
  return `file://${uri}`
}

export default toBaseUrl
