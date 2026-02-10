import { EditorWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import * as GetParsedNodesChildNodeCount from '../GetParsedNodesChildNodeCount/GetParsedNodesChildNodeCount.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const loadContent = async (state: PreviewState): Promise<PreviewState> => {
  // Try to register to receive editor change notifications from the editor worker.
  // Use dynamic access and ignore errors so this is safe in environments where
  // the EditorWorker / ListenerType are not available (e.g. unit tests).
  const EditorChange = 1
  const rpcId = 9112
  try {
    await EditorWorker.invoke('Listener.register', EditorChange, rpcId)
  } catch (error) {
    console.error(error)
  }

  const { uri } = state

  // Read and parse file contents if we have a URI
  const { content, css, errorMessage, parsedDom, parsedNodesChildNodeCount, scripts } = uri
    ? await updateContent(state, state.uri)
    : {
      content: state.content,
      css: state.css,
      errorMessage: state.errorMessage,
      parsedDom: state.parsedDom,
      parsedNodesChildNodeCount: state.parsedNodesChildNodeCount,
      scripts: state.scripts,
    }

  const { sandboxRpc } = state
  let finalParsedDom = parsedDom
  let finalCss = css
  let finalParsedNodesChildNodeCount = parsedNodesChildNodeCount

  if (scripts.length > 0) {
    const { content,
      height, scripts,
      uid,
      width } = state
    await sandboxRpc.invoke('SandBox.loadContent', uid, width, height, content, scripts)
    const serialized = await sandboxRpc.invoke('SandBox.getSerializedDom', uid)
    finalParsedDom = serialized.dom
    finalCss = serialized.css
    finalParsedNodesChildNodeCount = GetParsedNodesChildNodeCount.getParsedNodesChildNodeCount(finalParsedDom)
  }

  return {
    ...state,
    content,
    css: finalCss,
    errorCount: 0,
    errorMessage,
    initial: false,
    parsedDom: finalParsedDom,
    parsedNodesChildNodeCount: finalParsedNodesChildNodeCount,
    sandboxRpc,
    scripts,
    warningCount: 1,
  }
}
