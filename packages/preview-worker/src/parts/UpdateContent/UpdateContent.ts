import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as IsTsxUri from '../IsTsxUri/IsTsxUri.ts'
import * as LoadScripts from '../LoadScripts/LoadScripts.ts'
import * as LoadStyleSheets from '../LoadStyleSheets/LoadStyleSheets.ts'
import * as LoadTsx from '../LoadTsx/LoadTsx.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'

export const updateContent = async (state: PreviewState, uri: string): Promise<PreviewState> => {
  try {
    const { loadExternalStyleSheets, loadJavaScript, loadStyleElements } = state
    // Read the file content using RendererWorker RPC
    const content = await RendererWorker.readFile(uri)

    if (IsTsxUri.isTsxUri(uri)) {
      const tsxResult = await LoadTsx.loadTsx(state, content)
      return {
        ...state,
        ...tsxResult,
      }
    }

    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    const parsedDom = parseResult.dom
    const css = await LoadStyleSheets.loadStyleSheets(uri, parseResult.styleSheets, loadExternalStyleSheets, loadStyleElements)
    const scripts = loadJavaScript ? parseResult.scripts : []

    if (scripts.length > 0) {
      return LoadScripts.loadScripts(state, content, css, scripts)
    }

    const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

    return {
      ...state,
      content,
      css,
      errorMessage: '',
      parsedDom,
      parsedNodesChildNodeCount,
      scripts,
      styleSheets: parseResult.styleSheets,
    }
  } catch (error) {
    // If file reading or parsing fails, return empty content and parsedDom with error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      ...state,
      content: '',
      css: [],
      errorMessage,
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
      styleSheets: [],
    }
  }
}
