import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'
import { resolveStylesheetUri } from '../ResolveStylesheetUri/ResolveStylesheetUri.ts'

export const hasMatchingLinkedStyleSheet = (documentUri: string, styleSheets: readonly StyleSheet[], changedEditorUri: string): boolean => {
  for (const styleSheet of styleSheets) {
    if (styleSheet.type !== 'link' || !styleSheet.href) {
      continue
    }
    const styleSheetUri = resolveStylesheetUri(documentUri, styleSheet.href)
    if (styleSheetUri && styleSheetUri === changedEditorUri) {
      return true
    }
  }
  return false
}
