import { hasScheme } from '../HasScheme/HasScheme'
import { isBlockedStylesheetHref } from '../IsBlockedStylesheetHref/IsBlockedStylesheetHref'
import { toBaseUrl } from '../ToBaseUrl/ToBaseUrl'

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
