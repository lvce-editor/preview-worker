import { RendererWorker } from '@lvce-editor/rpc-registry'

const isExternalUrl = (href: string): boolean => {
  return /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(href) || /^(?:data|javascript|blob):/i.test(href)
}

const toBaseUrl = (uri: string): string => {
  if (/^[a-z][a-z\d+.-]*:/i.test(uri)) {
    return uri
  }
  return `file://${uri}`
}

const resolveStylesheetUri = (documentUri: string, href: string): string => {
  if (!href || href.startsWith('#') || isExternalUrl(href)) {
    return ''
  }
  try {
    const baseUrl = toBaseUrl(documentUri)
    const resolved = new URL(href, baseUrl)
    if (resolved.protocol !== 'file:') {
      return ''
    }
    return decodeURIComponent(resolved.pathname)
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
    } catch {
      // Ignore missing or unreadable stylesheets so preview still renders
    }
  }
  return css
}
