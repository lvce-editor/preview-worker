import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'

const hasScheme = (uri: string): boolean => {
  return /^[a-z][a-z\d+.-]*:/i.test(uri)
}

const isAbsoluteFileSystemPath = (href: string): boolean => {
  return href.startsWith('/') || /^[a-zA-Z]:[\\/]/.test(href) || /^\\\\/.test(href)
}

const isBlockedStylesheetHref = (href: string): boolean => {
  if (/^\/\//.test(href)) {
    return true
  }
  if (isAbsoluteFileSystemPath(href)) {
    return true
  }
  if (/^(?:data|javascript|blob):/i.test(href)) {
    return true
  }
  if (/^(?:http|https|file):/i.test(href)) {
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

const loadLinkedStyleSheet = async (documentUri: string, href: string): Promise<string> => {
  const stylesheetUri = resolveStylesheetUri(documentUri, href)
  if (!stylesheetUri) {
    return ''
  }
  try {
    return await RendererWorker.readFile(stylesheetUri)
  } catch (error) {
    console.error(error)
    return ''
  }
}

export const loadStyleSheets = async (
  documentUri: string,
  styleSheets: readonly StyleSheet[],
  loadExternalStyleSheets: boolean,
  loadStyleElements: boolean,
): Promise<readonly string[]> => {
  const css: string[] = []
  for (const styleSheet of styleSheets) {
    if (styleSheet.type === 'style') {
      if (loadStyleElements && styleSheet.content) {
        css.push(styleSheet.content)
      }
      continue
    }
    if (!loadExternalStyleSheets || !styleSheet.href) {
      continue
    }
    const linkedStyleSheet = await loadLinkedStyleSheet(documentUri, styleSheet.href)
    if (linkedStyleSheet) {
      css.push(linkedStyleSheet)
    }
  }
  return css
}
