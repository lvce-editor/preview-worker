import { EditorWorker } from '@lvce-editor/rpc-registry'
import type { PreviewState } from '../PreviewState/PreviewState.ts'
import { createUuid } from '../CreateUuid/CreateUuid.ts'
import { updateContent } from '../UpdateContent/UpdateContent.ts'

export const loadContent = async (state: PreviewState): Promise<PreviewState> => {
  // Try to register to receive editor change notifications from the editor worker.
  // Use dynamic access and ignore errors so this is safe in environments where
  // the EditorWorker / ListenerType are not available (e.g. unit tests).
  const EditorChange = 1
  const rpcId = 9112
  const listenerId = createUuid()
  try {
    await EditorWorker.invoke('Listener.register', EditorChange, rpcId, listenerId)
  } catch (error) {
    console.error(error)
  }

  const { uri } = state

  // Read and parse file contents if we have a URI
  const { content, css, errorMessage, parsedDom, parsedNodesChildNodeCount, scripts, styleSheets } = uri
    ? await updateContent(state, state.uri)
    : {
        content: state.content,
        css: state.css,
        errorMessage: state.errorMessage,
        parsedDom: state.parsedDom,
        parsedNodesChildNodeCount: state.parsedNodesChildNodeCount,
        scripts: state.scripts,
        styleSheets: state.styleSheets,
      }

  return {
    ...state,
    content,
    css,
    errorCount: 0,
    errorMessage,
    initial: false,
    listenerId,
    parsedDom,
    parsedNodesChildNodeCount,
    scripts,
    styleSheets,
    warningCount: 1,
  }
}
