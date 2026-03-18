import { hasScheme } from '../HasScheme/HasScheme.ts'
import { isBlockedScriptSrc } from '../IsBlockedScriptSrc/IsBlockedScriptSrc.ts'
import { toBaseUrl } from '../ToBaseUrl/ToBaseUrl.ts'

export const resolveScriptUri = (documentUri: string, src: string): string => {
  if (!src || src.startsWith('#') || isBlockedScriptSrc(src)) {
    return ''
  }
  try {
    const baseUrl = toBaseUrl(documentUri)
    const resolved = new URL(src, baseUrl)
    if (resolved.protocol === 'file:' && !hasScheme(documentUri)) {
      return decodeURIComponent(resolved.pathname)
    }
    return resolved.href
  } catch {
    return ''
  }
}