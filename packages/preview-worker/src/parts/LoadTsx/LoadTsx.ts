import type { PreviewState } from '../PreviewState/PreviewState.ts'
import type { TsxLoadResult } from './TsxLoadResult.ts'
import * as LoadScripts from '../LoadScripts/LoadScripts.ts'
import { getTsxScripts } from './GetTsxScripts.ts'

const TSX_PREVIEW_HTML = '<!doctype html><html><head></head><body><div id="root"></div></body></html>'

export const loadTsx = async (state: PreviewState, content: string): Promise<TsxLoadResult> => {
  if (!state.loadJavaScript) {
    return {
      content,
      css: [],
      errorMessage: 'JavaScript execution is disabled, TSX preview is unavailable',
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
      styleSheets: [],
    }
  }

  try {
    const scripts = await getTsxScripts(content)
    const scriptResult = await LoadScripts.loadScripts(state, TSX_PREVIEW_HTML, [], scripts)
    return {
      content,
      css: scriptResult.css,
      errorMessage: '',
      parsedDom: scriptResult.parsedDom,
      parsedNodesChildNodeCount: scriptResult.parsedNodesChildNodeCount,
      scripts,
      styleSheets: [],
    }
  } catch (error) {
    return {
      content,
      css: [],
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
      styleSheets: [],
    }
  }
}
