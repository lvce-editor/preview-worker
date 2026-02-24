import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as LoadScripts from '../LoadScripts/LoadScripts.ts'
import * as LoadStyleSheets from '../LoadStyleSheets/LoadStyleSheets.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'

export const updateContent = async (state: PreviewState, uri: string): Promise<PreviewState> => {
  try {
    // Read the file content using RendererWorker RPC
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    const parsedDom = parseResult.dom
    const css = await LoadStyleSheets.loadStyleSheets(state.uri, parseResult.styleSheets, state.loadExternalStyleSheets, state.loadStyleElements)
    const scripts = state.loadJavaScript ? parseResult.scripts : []

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
