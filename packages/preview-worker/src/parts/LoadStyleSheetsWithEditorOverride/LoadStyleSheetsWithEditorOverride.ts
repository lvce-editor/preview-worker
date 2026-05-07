/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */

import type { StyleSheet } from '../StyleSheet/StyleSheet.ts'
import type { StyleElementStyleSheet } from '../StyleSheet/StyleSheet.ts'
import { isSameUri } from '../HasMatchingLinkedStyleSheet/HasMatchingLinkedStyleSheet.ts'
import { resolveStylesheetUri } from '../ResolveStylesheetUri/ResolveStylesheetUri.ts'

const appendCurrentStyleElement = (css: string[], currentCss: readonly string[], cssIndex: number, styleSheet: StyleElementStyleSheet): number => {
  if (cssIndex < currentCss.length) {
    css.push(currentCss[cssIndex])
  } else if (styleSheet.content) {
    css.push(styleSheet.content)
  }
  return cssIndex + 1
}

const appendExistingLinkedStyleSheet = (css: string[], currentCss: readonly string[], cssIndex: number): number => {
  if (cssIndex < currentCss.length) {
    css.push(currentCss[cssIndex])
    return cssIndex + 1
  }
  return cssIndex
}

const getUpdatedCssIndexForOverride = (cssIndex: number, currentCss: readonly string[], css: string[], changedEditorContent: string): number => {
  if (changedEditorContent) {
    css.push(changedEditorContent)
  }
  return cssIndex < currentCss.length ? cssIndex + 1 : cssIndex
}

const handleStyleSheet = (
  documentUri: string,
  styleSheet: StyleSheet,
  currentCss: readonly string[],
  css: string[],
  cssIndex: number,
  loadExternalStyleSheets: boolean,
  loadStyleElements: boolean,
  changedEditorUri: string,
  changedEditorContent: string,
): number => {
  if (styleSheet.type === 'style') {
    if (loadStyleElements && styleSheet.content) {
      return appendCurrentStyleElement(css, currentCss, cssIndex, styleSheet)
    }
    return cssIndex
  }
  if (!loadExternalStyleSheets || !styleSheet.href) {
    return cssIndex
  }
  const styleSheetUri = resolveStylesheetUri(documentUri, styleSheet.href)
  if (!styleSheetUri) {
    return cssIndex
  }
  if (isSameUri(styleSheetUri, changedEditorUri)) {
    return getUpdatedCssIndexForOverride(cssIndex, currentCss, css, changedEditorContent)
  }
  return appendExistingLinkedStyleSheet(css, currentCss, cssIndex)
}

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
    cssIndex = handleStyleSheet(
      documentUri,
      styleSheet,
      currentCss,
      css,
      cssIndex,
      loadExternalStyleSheets,
      loadStyleElements,
      changedEditorUri,
      changedEditorContent,
    )
  }
  return css
}
