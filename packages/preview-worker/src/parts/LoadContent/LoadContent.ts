import { EditorWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
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

  // Read and parse file contents if we have a URI
  const { content, errorMessage, parsedDom, parsedNodesChildNodeCount } = state.uri
    ? await updateContent(state, state.uri)
    : {
        content: state.content,
        errorMessage: state.errorMessage,
        parsedDom: state.parsedDom,
        parsedNodesChildNodeCount: state.parsedNodesChildNodeCount,
      }

  return {
    ...state,
    content,
    errorCount: 0,
    errorMessage,
    initial: false,
    parsedDom,
    parsedNodesChildNodeCount,
    warningCount: 1,
  }
}
