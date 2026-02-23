import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'
import { loadLinkedStyleSheet } from '../LoadLinkedStyleSheet/LoadLinkedStyleSheet.ts'

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
