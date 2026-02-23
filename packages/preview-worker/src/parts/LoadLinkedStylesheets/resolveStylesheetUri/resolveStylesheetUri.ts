import { hasScheme } from '../hasScheme/hasScheme'
import { isBlockedStylesheetHref } from '../isBlockedStylesheetHref/isBlockedStylesheetHref'
import { toBaseUrl } from '../toBaseUrl/toBaseUrl'

export const resolveStylesheetUri = (documentUri: string, href: string): string => {
  if (!href || href.startsWith('#') || isBlockedStylesheetHref(href)) {
    return ''
  }
  try {
    const baseUrl = toBaseUrl(documentUri)
    const resolved = new URL(href, baseUrl)
    if (/^(?:http|https):$/i.test(resolved.protocol)) {
      return ''
    }
    if (resolved.protocol === 'file:' && !hasScheme(documentUri)) {
      return decodeURIComponent(resolved.pathname)
    }
    return resolved.href
  } catch {
    return ''
  }
}

export default resolveStylesheetUri
