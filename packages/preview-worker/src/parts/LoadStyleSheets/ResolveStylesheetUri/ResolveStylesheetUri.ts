import { hasScheme } from '../HasScheme/HasScheme.ts'
import { isBlockedStylesheetHref } from '../IsBlockedStylesheetHref/IsBlockedStylesheetHref.ts'
import { toBaseUrl } from '../ToBaseUrl/ToBaseUrl.ts'

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
