import { RendererWorker } from '@lvce-editor/rpc-registry'

const hasScheme = (uri: string): boolean => {
  return /^[a-z][a-z\d+.-]*:/i.test(uri)
}

const isBlockedStylesheetHref = (href: string): boolean => {
  if (/^\/\//.test(href)) {
    return true
  }
  if (/^(?:data|javascript|blob):/i.test(href)) {
    return true
  }
  if (/^(?:http|https):/i.test(href)) {
    return true
  }
  return false
}

const toBaseUrl = (uri: string): string => {
  if (hasScheme(uri)) {
    return uri
  }
  return `file://${uri}`
}

const resolveStylesheetUri = (documentUri: string, href: string): string => {
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

export const loadLinkedStylesheets = async (documentUri: string, hrefs: readonly string[]): Promise<readonly string[]> => {
  const css: string[] = []
  for (const href of hrefs) {
    const stylesheetUri = resolveStylesheetUri(documentUri, href)
    if (!stylesheetUri) {
      continue
    }
    try {
      const stylesheetContent = await RendererWorker.readFile(stylesheetUri)
      css.push(stylesheetContent)
    } catch (error) {
      console.error(error)
      // Ignore missing or unreadable stylesheets so preview still renders
    }
  }
  return css
}
