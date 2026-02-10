import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'

export const updateContent = async (
  uri: string,
): Promise<{
  content: string
  css: readonly string[]
  parsedDom: readonly VirtualDomNode[]
  parsedNodesChildNodeCount: number
  scripts: readonly string[]
  errorMessage: string
}> => {
  try {
    // Read the file content using RendererWorker RPC
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    const parsedDom = parseResult.dom
    const { css } = parseResult
    const { scripts } = parseResult

    const parsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(parsedDom)

    return {
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
      content: '',
      css: [],
      errorMessage,
      parsedDom: [],
      parsedNodesChildNodeCount: 0,
      scripts: [],
    }
  }
}
