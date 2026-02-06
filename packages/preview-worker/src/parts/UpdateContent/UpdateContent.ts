import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'

export const updateContent = async (
  state: PreviewState,
  uri: string,
): Promise<{ content: string; css: readonly string[]; parsedDom: readonly VirtualDomNode[]; parsedNodesChildNodeCount: number; errorMessage: string }> => {
  try {
    // Read the file content using RendererWorker RPC
    // @ts-ignore
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    const parsedDom = parseResult.dom
    const css = parseResult.css
    const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

    return {
      content,
      css,
      errorMessage: '',
      parsedDom,
      parsedNodesChildNodeCount,
    }
  } catch (error) {
    // If file reading or parsing fails, return empty content and parsedDom with error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: '',
      css: [],
      errorMessage,
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
    }
  }
}
