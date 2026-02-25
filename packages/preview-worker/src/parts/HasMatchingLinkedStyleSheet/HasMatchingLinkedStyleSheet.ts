import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'
import { resolveStylesheetUri } from '../ResolveStylesheetUri/ResolveStylesheetUri.ts'

const normalizeUri = (uri: string): string => {
  if (!uri) {
    return uri
  }
  if (uri.startsWith('file://')) {
    try {
      return decodeURIComponent(new URL(uri).pathname)
    } catch {
      return uri
    }
  }
  try {
    return decodeURIComponent(uri)
  } catch {
    return uri
  }
}

export const isSameUri = (left: string, right: string): boolean => {
  if (left === right) {
    return true
  }
  return normalizeUri(left) === normalizeUri(right)
}

export const hasMatchingLinkedStyleSheet = (documentUri: string, styleSheets: readonly StyleSheet[], changedEditorUri: string): boolean => {
  for (const styleSheet of styleSheets) {
    if (styleSheet.type !== 'link' || !styleSheet.href) {
      continue
    }
    const styleSheetUri = resolveStylesheetUri(documentUri, styleSheet.href)
    if (styleSheetUri && isSameUri(styleSheetUri, changedEditorUri)) {
      return true
    }
  }
  return false
}
