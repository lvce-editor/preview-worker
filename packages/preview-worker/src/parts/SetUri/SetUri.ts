import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'

export const setUri = async (state: PreviewState, uri: string): Promise<PreviewState> => {
<<<<<<< HEAD
  return {
    ...state,
    uri,
=======
  try {
    // Read the file content using RendererWorker RPC
    // @ts-ignore
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM
    const parsedDom = ParseHtml.parseHtml(content, [])

    return {
      ...state,
      content,
      parsedDom,
      uri,
    }
  } catch {
    // If file reading fails, return state with just the URI set
    return {
      ...state,
      content: '',
      parsedDom: [],
      uri,
    }
>>>>>>> origin/main
  }
}
