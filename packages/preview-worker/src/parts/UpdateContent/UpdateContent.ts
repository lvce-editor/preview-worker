import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'

export const updateContent = async (state: PreviewState, uri: string): Promise<PreviewState> => {
  try {
    // Read the file content using RendererWorker RPC
    const content = await RendererWorker.readFile(uri)

    const { sandboxRpc } = state
    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    const parsedDom = parseResult.dom
    const { css } = parseResult
    const { scripts } = parseResult


    if (scripts.length > 0) {
      const { content, height, scripts, uid, width } = state
      await sandboxRpc.invoke('SandBox.loadContent', uid, width, height, content, scripts)
      const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
      const finalParsedDom = serialized.dom
      const finalParsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(finalParsedDom)
      return {
        ...state,
        content,
        css,
        errorMessage: '',
        parsedDom,
        parsedNodesChildNodeCount: finalParsedNodesChildNodeCount,
        scripts,
      }
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
    }
  }
}
