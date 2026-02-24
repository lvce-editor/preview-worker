import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'
import { loadLinkedStyleSheet } from '../LoadLinkedStyleSheet/LoadLinkedStyleSheet.ts'
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

export const loadStyleSheetsWithEditorOverride = async (
  documentUri: string,
  styleSheets: readonly StyleSheet[],
  loadExternalStyleSheets: boolean,
  loadStyleElements: boolean,
  changedEditorUri: string,
  changedEditorContent: string,
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
    const styleSheetUri = resolveStylesheetUri(documentUri, styleSheet.href)
    if (!styleSheetUri) {
      continue
    }
    if (styleSheetUri === changedEditorUri) {
      if (changedEditorContent) {
        css.push(changedEditorContent)
      }
      continue
    }
    const linkedStyleSheet = await loadLinkedStyleSheet(documentUri, styleSheet.href)
    if (linkedStyleSheet) {
      css.push(linkedStyleSheet)
    }
  }
  return css
}
