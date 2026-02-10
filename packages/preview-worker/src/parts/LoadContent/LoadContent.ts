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

  return {
    ...state,
    content,
    css,
    errorCount: 0,
    errorMessage,
    initial: false,
    parsedDom,
    parsedNodesChildNodeCount,
    scripts,
    warningCount: 1,
  }
}
