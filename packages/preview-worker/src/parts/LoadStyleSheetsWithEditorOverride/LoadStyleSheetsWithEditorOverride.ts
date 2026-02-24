import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'
import { resolveStylesheetUri } from '../ResolveStylesheetUri/ResolveStylesheetUri.ts'

export const loadStyleSheetsWithEditorOverride = async (
  documentUri: string,
  styleSheets: readonly StyleSheet[],
  currentCss: readonly string[],
  loadExternalStyleSheets: boolean,
  loadStyleElements: boolean,
  changedEditorUri: string,
  changedEditorContent: string,
): Promise<readonly string[]> => {
  const css: string[] = []
  let cssIndex = 0
  for (const styleSheet of styleSheets) {
    if (styleSheet.type === 'style') {
      if (loadStyleElements && styleSheet.content) {
        if (cssIndex < currentCss.length) {
          css.push(currentCss[cssIndex])
        } else {
          css.push(styleSheet.content)
        }
        cssIndex++
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
      if (cssIndex < currentCss.length) {
        cssIndex++
      }
      continue
    }
    if (cssIndex < currentCss.length) {
      css.push(currentCss[cssIndex])
      cssIndex++
    }
  }
  return css
}
