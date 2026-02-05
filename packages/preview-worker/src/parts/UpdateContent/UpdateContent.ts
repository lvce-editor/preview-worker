import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'

export const updateContent = async (state: PreviewState, uri: string): Promise<{ content: string; parsedDom: readonly VirtualDomNode[]; errorMessage: string }> => {
  try {
    // Read the file content using RendererWorker RPC
    // @ts-ignore
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM
    const parsedDom = ParseHtml.parseHtml(content, [])

    return {
      content,
      parsedDom,
      errorMessage: '',
    }
  } catch (error) {
    // If file reading or parsing fails, return empty content and parsedDom with error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      content: '',
      parsedDom: [],
      errorMessage,
    }
  }
}
