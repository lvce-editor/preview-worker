import type { VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as ExecuteScripts from '../ExecuteScripts/ExecuteScripts.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import * as ParseHtml from '../ParseHtml/ParseHtml.ts'
import * as SerializeHappyDom from '../SerializeHappyDom/SerializeHappyDom.ts'

export const updateContent = async (
  state: PreviewState,
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
    // @ts-ignore
    const content = await RendererWorker.readFile(uri)

    // Parse the content into virtual DOM and CSS
    const parseResult = ParseHtml.parseHtml(content)
    let parsedDom = parseResult.dom
    let {css} = parseResult
    const { scripts } = parseResult

    // If scripts are present, execute them via happy-dom and re-serialize the DOM
    if (scripts.length > 0) {
      try {
        const happyDomDocument = ExecuteScripts.executeScripts(content, scripts)
        const serialized = SerializeHappyDom.serialize(happyDomDocument)
        parsedDom = serialized.dom
        css = serialized.css
      } catch {
        // If script execution fails, fall back to static HTML parsing
      }
    }

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
