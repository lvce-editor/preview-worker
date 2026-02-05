import { EditorWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const loadContent = async (state: PreviewState): Promise<PreviewState> => {
  try {
    // Try to register to receive editor change notifications from the editor worker.
    // Use dynamic access and ignore errors so this is safe in environments where
    // the EditorWorker / ListenerType are not available (e.g. unit tests).
    const EditorChange = 1
    const rpcId = 9112
    try {
      await EditorWorker.invoke('Listener.register', EditorChange, rpcId)
      // eslint-disable-next-line no-console
      console.log('Preview worker registered for editor changes')
    } catch {
      // ignore registration errors
    }
  } catch {
    // ignore any unexpected errors during registration
  }

  // Read and parse file contents if we have a URI
  const { content, errorMessage, parsedDom } = state.uri
    ? await updateContent(state, state.uri)
    : { content: state.content, errorMessage: state.errorMessage, parsedDom: state.parsedDom }

  return {
    ...state,
    content,
    errorCount: 0,
    errorMessage,
    initial: false,
    parsedDom,
    warningCount: 1,
  }
}
